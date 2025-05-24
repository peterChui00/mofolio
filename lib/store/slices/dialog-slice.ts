import { VariantProps } from 'class-variance-authority';
import { StateCreator } from 'zustand';

import { Store } from '@/lib/store';
import { buttonVariants } from '@/components/ui/button';

export type DialogSliceState = {
  isConfirmDialogOpen: boolean;
  confirmDialog: {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmVariant?: VariantProps<typeof buttonVariants>['variant'];
    isLoading?: boolean;
    confirmingText?: string;
  };

  isEditTradeDialogOpen: boolean;
  editTradeDialog: {
    title: string;
    tab?: string;
    id?: string;
    symbol?: string;
    notes?: string;
    tags?: string[];
  };

  isEditTagGroupDialogOpen: boolean;
  editTagGroupDialog: {
    title: string;
    tagGroupId?: string;
    tagGroupName?: string;
  };

  isEditTagDialogOpen: boolean;
  editTagDialog: {
    title: string;
    tagId?: string;
    tagName?: string;
    tagGroupId?: string;
  };

  isEditJournalEntryDialogOpen: boolean;
  editJournalEntryDialog: {
    title: string;
    id?: string;
    entryTitle?: string;
  };
};

export type DialogSliceActions = {
  resetDialogState(): void;
  toggleConfirmDialog(
    open?: boolean,
    dialogState?: DialogSliceState['confirmDialog']
  ): void;
  toggleConfirmDialogLoading(isLoading?: boolean): void;
  toggleEditTradeDialog(
    open?: boolean,
    dialogState?: DialogSliceState['editTradeDialog']
  ): void;
  setEditTradeDialogTab(tab: string): void;
  toggleEditTagGroupDialog(
    open?: boolean,
    dialogState?: DialogSliceState['editTagGroupDialog']
  ): void;
  toggleEditTagDialog(
    open?: boolean,
    dialogState?: DialogSliceState['editTagDialog']
  ): void;
  toggleEditJournalEntryDialog(
    open?: boolean,
    dialogState?: DialogSliceState['editJournalEntryDialog']
  ): void;
};

export type DialogSlice = DialogSliceState & DialogSliceActions;

export const initialDialogState: DialogSliceState = {
  isConfirmDialogOpen: false,
  confirmDialog: {
    title: undefined,
    description: undefined,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'default',
    onConfirm: undefined,
    onCancel: undefined,
    isLoading: false,
    confirmingText: 'Loading...',
  },
  isEditTradeDialogOpen: false,
  editTradeDialog: {
    title: 'Add trade',
    tab: 'trade',
    id: undefined,
    symbol: undefined,
    notes: undefined,
    tags: undefined,
  },
  isEditTagGroupDialogOpen: false,
  editTagGroupDialog: {
    title: 'Add tag group',
    tagGroupId: undefined,
    tagGroupName: undefined,
  },
  isEditTagDialogOpen: false,
  editTagDialog: {
    title: 'Add tag',
    tagId: undefined,
    tagName: undefined,
    tagGroupId: undefined,
  },
  isEditJournalEntryDialogOpen: false,
  editJournalEntryDialog: {
    title: 'Add journal entry',
    id: undefined,
    entryTitle: undefined,
  },
};

export const createDialogSlice: StateCreator<Store, [], [], DialogSlice> = (
  set
) => ({
  ...initialDialogState,

  resetDialogState: () => set(initialDialogState),

  toggleConfirmDialog: (open, dialogState) => {
    set((state) => ({
      isConfirmDialogOpen: open ?? !state.isConfirmDialogOpen,
      confirmDialog: {
        ...state.confirmDialog,
        ...(open && initialDialogState.confirmDialog),
        ...dialogState,
      },
    }));
  },

  toggleConfirmDialogLoading: (isLoading) => {
    set((state) => ({
      confirmDialog: {
        ...state.confirmDialog,
        isLoading: isLoading ?? !state.confirmDialog.isLoading,
      },
    }));
  },

  toggleEditTradeDialog: (open, dialogState) => {
    set((state) => ({
      isEditTradeDialogOpen: open ?? !state.isEditTradeDialogOpen,
      editTradeDialog: {
        ...state.editTradeDialog,
        ...(open && initialDialogState.editTradeDialog),
        ...dialogState,
      },
    }));
  },

  setEditTradeDialogTab: (tab) => {
    set((state) => ({
      editTradeDialog: {
        ...state.editTradeDialog,
        tab,
      },
    }));
  },

  toggleEditTagGroupDialog: (open, dialogState) => {
    set((state) => ({
      isEditTagGroupDialogOpen: open ?? !state.isEditTagGroupDialogOpen,
      editTagGroupDialog: {
        ...state.editTagGroupDialog,
        ...(open && initialDialogState.editTagGroupDialog),
        ...dialogState,
      },
    }));
  },

  toggleEditTagDialog: (open, dialogState) => {
    set((state) => ({
      isEditTagDialogOpen: open ?? !state.isEditTagDialogOpen,
      editTagDialog: {
        ...state.editTagDialog,
        ...(open && initialDialogState.editTagDialog),
        ...dialogState,
      },
    }));
  },

  toggleEditJournalEntryDialog: (open, dialogState) => {
    set((state) => ({
      isEditJournalEntryDialogOpen: open ?? !state.isEditJournalEntryDialogOpen,
      editJournalEntryDialog: {
        ...state.editJournalEntryDialog,
        ...(open && initialDialogState.editJournalEntryDialog),
        ...dialogState,
      },
    }));
  },
});
