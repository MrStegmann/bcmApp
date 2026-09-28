import { create } from "zustand";
import { db, fees } from "../db";
import { Fee, NewFee } from "../types/database";
import { eq } from "drizzle-orm";

export interface FeesStoreState {
  feesList: Fee[];
  fees: Fee[];
  isLoading: boolean;
  error: string | null;

  fetchFees: (teamId: number) => Promise<Fee[]>;
  createFee: (feeData: NewFee) => Promise<Fee | null>;
  toggleFeePayment: (feeId: number, paidStatus: boolean) => Promise<boolean>;
  deleteFee: (feeId: number) => Promise<boolean>;
}

export const useFeesStore = create<FeesStoreState>((set, get) => ({
  feesList: [],
  fees: [],
  isLoading: false,
  error: null,

  fetchFees: async (teamId: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await db.select().from(fees).where(eq(fees.teamId, teamId));
      set({ feesList: result, fees: result, isLoading: false });
      return result;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch fees", isLoading: false });
      return [];
    }
  },

  createFee: async (feeData: NewFee) => {
    set({ isLoading: true, error: null });
    try {
      const [newFee] = await db.insert(fees).values(feeData).returning();
      const updated = [...get().feesList, newFee];
      set({ feesList: updated, fees: updated, isLoading: false });
      return newFee;
    } catch (err: any) {
      set({ error: err.message || "Failed to create fee", isLoading: false });
      return null;
    }
  },

  toggleFeePayment: async (feeId: number, paidStatus: boolean) => {
    set({ isLoading: true, error: null });
    try {
      await db
        .update(fees)
        .set({ paid: paidStatus ? 1 : 0 })
        .where(eq(fees.id, feeId));
      const updatedList = get().feesList.map((f) =>
        f.id === feeId ? { ...f, paid: paidStatus ? 1 : 0 } : f
      );
      set({ feesList: updatedList, fees: updatedList, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || "Failed to toggle fee payment", isLoading: false });
      return false;
    }
  },

  deleteFee: async (feeId: number) => {
    set({ isLoading: true, error: null });
    try {
      await db.delete(fees).where(eq(fees.id, feeId));
      const updated = get().feesList.filter((f) => f.id !== feeId);
      set({ feesList: updated, fees: updated, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || "Failed to delete fee", isLoading: false });
      return false;
    }
  },
}));

export default useFeesStore;
