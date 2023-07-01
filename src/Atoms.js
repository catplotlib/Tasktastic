import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'
export const userAtom = atomWithStorage(null);
export const userNameAtom = atomWithStorage("");
export const emailAtom = atomWithStorage("");
export const picAtom = atomWithStorage("");
export const loginAtom = atomWithStorage(false);
export const tokenAtom=atomWithStorage(null);
