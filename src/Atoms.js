import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'
export const userAtom = atomWithStorage(null);
export const userNameAtom = atomWithStorage("");
