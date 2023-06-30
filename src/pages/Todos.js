import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  HStack,
  IconButton,
  Button,
  Flex,
  Badge,
  Grid,
  GridItem,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useBreakpointValue,
  Avatar,
  Fade,
  Radio,
  RadioGroup,
  Textarea,
  Image,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, AddIcon } from "@chakra-ui/icons";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { userNameAtom, emailAtom, picAtom } from "../Atoms";
import axios from "axios";

const Todos = () => {
  const [userName, setUserName] = useAtom(userNameAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [pic, setPic] = useAtom(picAtom);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([
    // {
    //   id: "1",
    //   title: "Demo Task",
    //   description: "Demo Description",
    //   dueDate: "2023-05-15",
    //   done: false,
    //   status: "todo",
    // },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/tasks")
      .then((res) => {
        const userTasks = res.data.filter((task) => {
          console.log(task.user);
          return task.user === email;
        });
        setTasks(userTasks);
      })
      .catch((err) => console.log(err));
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("todo");

  const [newTask, setNewTask] = useState({
    user: email,
    title: "",
    description: "",
    dueDate: "",
    todo: "todo",
  });
  const [activeStatusFilter, setActiveStatusFilter] = useState("todo");

  const getTaskCount = (status) => {
    if (status === null || status === undefined) {
      return tasks.length;
    } else {
      return tasks.filter((task) => task.status === status).length;
    }
  };

  const maxDescriptionLength = useBreakpointValue({
    base: 120,
    sm: 120,
    md: 120,
    lg: 160,
    xl: 180,
  });

  const getStatusColorScheme = (status) => {
    switch (status) {
      case "todo":
        return "#DA6174";
      // case "doing":
      //   return "#728690";
      case "done":
        return "#34692F";
      default:
        return "gray";
    }
  };

  const handleStatusFilterClick = (status) => {
    setSelectedStatus(status);
    setActiveStatusFilter(status === "total" ? null : status);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // const handleSave = () => {
  //   setTasks([...tasks, newTask]);
  //   setNewTask({ title: "", description: "", dueDate: "" });
  //   closeModal();
  // };

  const handleSave = () => {
    console.log(newTask);
    fetch("http://localhost:8000/api/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // include other headers as needed
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks([...tasks, data]);
        setNewTask({ title: "", description: "", dueDate: "", user: email });
        closeModal();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getCurrentStatusHeading = () => {
    if (activeStatusFilter === "todo") {
      return "Tasks to do";
    } else if (activeStatusFilter === "done") {
      return "Tasks that are done";
      // } else if (activeStatusFilter === "doing") {
      //   return "Tasks in Progress";
    } else {
      return "Overview of all tasks";
    }
  };
  const MotionVStack = motion(VStack);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };
  const handleUpdate = () => {
    fetch(`http://localhost:8000/api/tasks/${selectedTask.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // include other headers as needed
      },
      body: JSON.stringify(selectedTask),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(tasks.map((task) => (task.id === data.id ? data : task)));
        setSelectedTask(null);
        setIsEditModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getEmptyTasksHeading = (status) => {
    switch (status) {
      case "todo":
        return "No tasks to do yet. Add a new task to get started.";
      // case "doing":
      //   return "No tasks in progress yet. Add a new task to get started.";
      case "done":
        return "No tasks are done yet. Add a new task to get started.";
      default:
        return "No tasks yet. Add a new task to get started.";
    }
  };

  return (
    <Flex
      h={{ base: "auto", md: "100vh" }}
      minH={{ base: "", md: "100vh" }}
      direction={{ base: "column-reverse", md: "row" }}
      bg="#EACBBC"
      pb={{ base: "30px", md: "0px" }}
    >
      <VStack
        spacing={8}
        w={{ base: "100%", md: "80%" }}
        px={{ base: 4, md: 0 }}
        mt={{ base: 4, md: "10vh" }}
      >
        <IconButton
          position={{ base: "relative", md: "absolute" }}
          top={{ base: "0vh", md: "12vh" }}
          alignSelf="flex-end"
          icon={<AddIcon />}
          colorScheme="red"
          size="lg"
          borderRadius="full"
          aria-label="Add task"
          onClick={openModal}
        />
        <Heading
          fontFamily="comfortaa"
          size={{ base: "md", md: "lg" }}
          color="#1F324E"
        >
          {getCurrentStatusHeading()}
        </Heading>
        {tasks.filter(
          (task) =>
            activeStatusFilter === null || task.status === activeStatusFilter
        ).length === 0 ? (
          <Flex
            w="100%"
            h={{ md: "60%", base: "50vh" }}
            justifyContent="center"
            alignItems="center"
          >
            <Heading
              fontFamily="comfortaa"
              size="xl"
              color="#C6ADA7"
              textAlign="center"
            >
              {getEmptyTasksHeading(selectedStatus)}
            </Heading>
          </Flex>
        ) : (
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            minH={{ md: "", base: "50vh" }}
            gap={6}
          >
            <AnimatePresence>
              {tasks
                .filter(
                  (task) =>
                    activeStatusFilter === null ||
                    task.status === activeStatusFilter
                )
                .sort((a, b) => {
                  const dateA = moment(a.dueDate);
                  const dateB = moment(b.dueDate);
                  return dateA.diff(dateB);
                })
                .map((task, index) => (
                  <GridItem
                    key={task.id}
                    _hover={{
                      transform: "scale(1.05)",
                      zIndex: 1,
                    }}
                    transition="all 0.3s ease-in-out"
                  >
                    <MotionVStack
                      spacing={4}
                      p={6}
                      borderRadius="xl"
                      boxShadow="md"
                      bg="rgba(255, 255, 255, 0.1)"
                      backdropFilter="blur(10px)"
                      h={{ base: "300px", md: "300px" }}
                      w={{ base: "300px", md: "300px" }}
                      cursor="pointer"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Heading
                        fontFamily="comfortaa"
                        fontWeight={700}
                        size={{ base: "md", md: "lg" }}
                        color="#1F324E"
                        onClick={() => openEditModal(task)}
                      >
                        {task.title}
                      </Heading>

                      <Text
                        fontFamily="comfortaa"
                        color="#1F324E"
                        flex="1"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        onClick={() => openEditModal(task)}
                      >
                        {task.description.slice(0, maxDescriptionLength)}...
                      </Text>

                      <Flex justifyContent="space-between" w="100%">
                        <Badge colorScheme="#1F324E">
                          {(() => {
                            const dueDate = moment(task.dueDate);
                            const today = moment();
                            const tomorrow = moment().add(1, "day");
                            const weekStart = moment().startOf("week");
                            const weekEnd = moment().endOf("week");

                            if (dueDate.isSame(today, "day")) {
                              return "Today";
                            } else if (dueDate.isSame(tomorrow, "day")) {
                              return "Tomorrow";
                            } else if (dueDate.isBetween(weekStart, weekEnd)) {
                              return dueDate.format("dddd");
                            } else if (dueDate.isAfter(weekEnd)) {
                              return "Later";
                            } else {
                              return dueDate.format("MMMM D, YYYY");
                            }
                          })()}
                        </Badge>
                        <Flex gap="10px">
                          <Badge
                            colorScheme={getStatusColorScheme(task.status)}
                          >
                            {task.status.charAt(0).toUpperCase() +
                              task.status.slice(1)}
                          </Badge>
                          <Checkbox
                            isChecked={task.status === "done"}
                            colorScheme="green"
                            borderRadius="md"
                            border="#1F324E"
                            onChange={(e) => {
                              const updatedTask = {
                                ...task,
                                status: e.target.checked ? "done" : "todo",
                                done: e.target.checked,
                              };

                              fetch(
                                `http://localhost:8000/api/tasks/${task.id}/`,
                                {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                    // include other headers as needed
                                  },
                                  body: JSON.stringify(updatedTask),
                                }
                              )
                                .then((response) => response.json())
                                .then((data) => {
                                  const updatedTasks = tasks.map((t) => {
                                    if (t.id === data.id) {
                                      return data;
                                    } else {
                                      return t;
                                    }
                                  });
                                  setTasks(updatedTasks);
                                })
                                .catch((error) => {
                                  console.error("Error:", error);
                                });
                            }}
                          />
                        </Flex>
                      </Flex>
                    </MotionVStack>
                  </GridItem>
                ))}
            </AnimatePresence>
          </Grid>
        )}
      </VStack>

      <Flex
        w={{ base: "100%", md: "30%" }}
        h={{ base: "auto", md: "100%" }}
        p={4}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        backgroundImage="url('https://img.freepik.com/premium-vector/japan-temple-asian-pagoda-japanese-traditional-landmark-with-cherry-blossom-tree_194708-1851.jpg')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        position="relative"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.5)"
        />
        <Flex w="80%" justify="space-between" alignItems="center" zIndex="1">
          <Flex direction="column">
            <Text
              fontFamily="comfortaa"
              fontSize={{ md: "4xl", base: "2xl" }}
              color="white"
              mt={{ md: 4, base: 16 }}
            >
              Dashboard
            </Text>
            {/* <Text
              fontFamily="comfortaa"
              fontSize={{ md: "4xl", base: "2xl" }}
              color="white"
              mt={-3}
            >
              {userName}
            </Text> */}
          </Flex>
          {/* <Avatar
            name={user.name}
            src={user.avatar}
            size="xl"
            mt={{ md: 4, base: 16 }}
          /> */}
          <Image
            borderRadius="full"
            boxSize="10"
            src={pic}
            alt="Profile picture"
            mb={{ base: 4, md: 0 }}
          />
        </Flex>

        <Grid
          templateColumns={{ base: "repeat(4, 1fr)", md: "repeat(2, 1fr)" }}
          gap={{ base: 1, md: 2 }}
          mt={{ base: 4, md: 8 }}
          w={{ base: "100%", md: "80%" }}
        >
          <Box
            bg="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
            borderRadius="xl"
            boxShadow="md"
            p={4}
            h={{ base: "80px", md: "150px" }}
            w={{ base: "80px", md: "150px" }}
            // minH={{ base: "30px", md: "150px" }}
            // minW={{ base: "80px", md: "150px" }}
            _hover={{ transform: "scale(1.05)" }}
            transition="all 0.3s ease-in-out"
            cursor="pointer"
            onClick={() => handleStatusFilterClick("todo")}
          >
            {selectedStatus === "todo" ? (
              <Text
                fontFamily="comfortaa"
                fontSize={{ base: "xs", md: "lg" }}
                color="#AFAFAF"
                textAlign="center"
              >
                <u>Todo</u>
              </Text>
            ) : (
              <Text
                fontFamily="comfortaa"
                fontSize={{ base: "xs", md: "lg" }}
                color="#AFAFAF"
                textAlign="center"
              >
                Todo
              </Text>
            )}

            <Text
              fontFamily="comfortaa"
              fontSize={{ base: "lg", md: "4xl" }}
              fontWeight={800}
              color="white"
              textAlign="center"
            >
              {getTaskCount("todo")}
            </Text>
          </Box>
          <Box
            bg="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
            borderRadius="xl"
            boxShadow="md"
            p={4}
            h={{ base: "80px", md: "150px" }}
            w={{ base: "80px", md: "150px" }}
            _hover={{ transform: "scale(1.05)" }}
            transition="all 0.3s ease-in-out"
            cursor="pointer"
            onClick={() => handleStatusFilterClick("done")}
          >
            {selectedStatus === "done" ? (
              <Text
                fontFamily="comfortaa"
                fontSize={{ base: "xs", md: "lg" }}
                color="#AFAFAF"
                textAlign="center"
              >
                <u>Done</u>
              </Text>
            ) : (
              <Text
                fontFamily="comfortaa"
                fontSize={{ base: "xs", md: "lg" }}
                color="#AFAFAF"
                textAlign="center"
              >
                Done
              </Text>
            )}
            <Text
              fontFamily="comfortaa"
              fontSize={{ base: "lg", md: "4xl" }}
              color="white"
              textAlign="center"
              fontWeight={800}
            >
              {getTaskCount("done")}
            </Text>
          </Box>
          {/* <Box
            bg="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
            borderRadius="xl"
            boxShadow="md"
            p={4}
            h={{ base: "80px", md: "150px" }}
            w={{ base: "80px", md: "150px" }}
            _hover={{ transform: "scale(1.05)" }}
            transition="all 0.3s ease-in-out"
            cursor="pointer"
            onClick={() => handleStatusFilterClick("doing")}
          >
            {selectedStatus === "doing" ? (
              <Text
                fontFamily="comfortaa"
                fontSize={{ base: "xs", md: "lg" }}
                color="#AFAFAF"
                textAlign="center"
              >
                <u>Doing</u>
              </Text>
            ) : (
              <Text
                fontFamily="comfortaa"
                fontSize={{ base: "xs", md: "lg" }}
                color="#AFAFAF"
                textAlign="center"
              >
                Doing
              </Text>
            )}
            <Text
              fontFamily="comfortaa"
              fontSize={{ base: "lg", md: "4xl" }}
              color="white"
              textAlign="center"
              fontWeight={800}
            >
              {getTaskCount("doing")}
            </Text>
          </Box> */}
          <Box
            bg="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
            borderRadius="xl"
            boxShadow="md"
            p={4}
            h={{ base: "80px", md: "150px" }}
            w={{ base: "80px", md: "150px" }}
            _hover={{ transform: "scale(1.05)" }}
            transition="all 0.3s ease-in-out"
            cursor="pointer"
            onClick={() => handleStatusFilterClick("total")}
          >
            {selectedStatus === "total" ? (
              <Text
                fontFamily="comfortaa"
                fontSize={{ base: "xs", md: "lg" }}
                color="#AFAFAF"
                textAlign="center"
              >
                <u>Total</u>
              </Text>
            ) : (
              <Text
                fontFamily="comfortaa"
                fontSize={{ base: "xs", md: "lg" }}
                color="#AFAFAF"
                textAlign="center"
              >
                Total
              </Text>
            )}
            <Text
              fontFamily="comfortaa"
              fontSize={{ base: "lg", md: "4xl" }}
              color="white"
              textAlign="center"
              fontWeight={800}
            >
              {getTaskCount(null)}
            </Text>
          </Box>
        </Grid>
      </Flex>
      {/* new task modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <Box zIndex="1">
          <ModalContent
            position={{ md: "fixed", base: "relative" }}
            left={{ md: "5%", base: "0" }}
            bg="#F1D5C3"
            backdropFilter="blur(10px)"
            borderRadius="md"
            p={4}
            color="#1F324E"
            maxWidth={{ md: "60%", base: "90%" }}
            minHeight="90vh"
          >
            <ModalHeader
              fontFamily={"comfortaa"}
              fontSize={{ base: "md", md: "3xl" }}
            >
              Add New Task
            </ModalHeader>
            <ModalCloseButton fontSize="lg" />
            <ModalBody>
              <FormControl>
                <FormLabel fontSize={{ base: "md", md: "3xl" }}>
                  Title
                </FormLabel>
                <Input
                  required
                  value={newTask.title}
                  border="1px solid #CB9379"
                  _hover={{ border: "1px solid #1F324E" }}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      id: Math.floor(Math.random() * 100),
                      title: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel fontSize={{ base: "md", md: "3xl" }}>
                  Description
                </FormLabel>
                <Textarea
                  required
                  height={{ base: "100px", md: "150px" }}
                  border="1px solid #CB9379"
                  _hover={{ border: "1px solid #1F324E" }}
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel fontSize={{ base: "md", md: "3xl" }}>
                  Due Date
                </FormLabel>
                <Input
                  required
                  className="custom-date-input"
                  type="date"
                  value={newTask.dueDate}
                  border="1px solid #CB9379"
                  _hover={{ border: "1px solid #1F324E" }}
                  color="#1F324E"
                  onChange={(e) => {
                    setNewTask({ ...newTask, dueDate: e.target.value });
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel fontSize={{ base: "md", md: "3xl" }}>
                  Status
                </FormLabel>
                <RadioGroup
                  required
                  value={newTask.status}
                  onChange={(value) =>
                    setNewTask({ ...newTask, status: value })
                  }
                >
                  <HStack spacing="12px">
                    <Radio value="todo">Todo</Radio>
                    {/* <Radio value="doing">Doing</Radio> */}
                    <Radio value="done">Done</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={handleSave}
                isDisabled={
                  !newTask.title ||
                  !newTask.description ||
                  !newTask.dueDate ||
                  !newTask.status
                }
              >
                Save
              </Button>
              <Button variant="ghost" color="#1F324E" onClick={closeModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Box>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <Box zIndex="1">
          <ModalContent
            position={{ md: "fixed", base: "relative" }}
            left={{ md: "5%", base: "0" }}
            bg="#F1D5C3"
            backdropFilter="blur(10px)"
            borderRadius="md"
            p={4}
            color="#1F324E"
            maxWidth={{ md: "60%", base: "90%" }}
            minHeight="90vh"
          >
            <ModalHeader
              fontFamily={"comfortaa"}
              fontSize={{ base: "md", md: "3xl" }}
            >
              Edit Task
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl id="title">
                <FormLabel fontSize={{ base: "md", md: "3xl" }}>
                  Title
                </FormLabel>
                <Input
                  value={selectedTask?.title || ""}
                  border="1px solid #CB9379"
                  _hover={{ border: "1px solid #1F324E" }}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      title: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl id="description" mt={4}>
                <FormLabel fontSize={{ base: "md", md: "3xl" }}>
                  Description
                </FormLabel>
                <Textarea
                  height={{ base: "100px", md: "150px" }}
                  value={selectedTask?.description || ""}
                  border="1px solid #CB9379"
                  _hover={{ border: "1px solid #1F324E" }}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      description: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl id="dueDate" mt={4}>
                <FormLabel fontSize={{ base: "md", md: "3xl" }}>
                  Due Date
                </FormLabel>
                <Input
                  type="date"
                  value={selectedTask?.dueDate || ""}
                  border="1px solid #CB9379"
                  _hover={{ border: "1px solid #1F324E" }}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      dueDate: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl id="status" mt={4}>
                <FormLabel fontSize={{ base: "md", md: "3xl" }}>
                  Status
                </FormLabel>
                <RadioGroup
                  value={selectedTask?.status || ""}
                  onChange={(status) =>
                    setSelectedTask({ ...selectedTask, status: status })
                  }
                >
                  <HStack spacing="24px">
                    <Radio value="todo">To do</Radio>
                    {/* <Radio value="doing">Doing</Radio> */}
                    <Radio value="done">Done</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
                Update
              </Button>
              <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Box>
      </Modal>
    </Flex>
  );
};

export default Todos;
