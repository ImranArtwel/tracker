// File: src/components/Section.tsx
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "../services/firebase";
import type { Item } from "../types";

export interface SectionData {
  id: string;
  name: string;
  items: Item[];
}

interface Props {
  projectId: string;
  section: SectionData;
  onUpdated: () => void;
}

interface FormValues {
  sectionName: string;
  items: { id: string; name: string; amount: number }[];
  newItem: { name: string; amount: number };
}

export const Section = ({ projectId, section, onUpdated }: Props) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { register, handleSubmit, watch, reset, getValues, setValue } =
    useForm<FormValues>({
      defaultValues: {
        sectionName: section.name,
        items: section.items,
        newItem: { name: "", amount: 0.0 },
      },
    });

  useEffect(() => {
    reset({
      sectionName: section.name,
      items: section.items,
      newItem: { name: "", amount: 0.0 },
    });
  }, [section, reset]);

  const onSaveSectionName = async () => {
    if (projectId === "B91ZvtvPvg2GGoKixLS0") {
      await updateDoc(doc(db, `expenses/${projectId}/sections/${section.id}`), {
        name: getValues("sectionName"),
      });
    } else {
      await updateDoc(doc(db, `projects/${projectId}/sections/${section.id}`), {
        name: getValues("sectionName"),
      });
    }
    onUpdated();
  };

  const onAddItem = async (data: FormValues) => {
    if (!data.newItem.name || !data.newItem.amount) return;

    if (editingItemId) {
      // Update existing item
      if (projectId === "B91ZvtvPvg2GGoKixLS0") {
        await updateDoc(
          doc(
            db,
            `expenses/${projectId}/sections/${section.id}/items/${editingItemId}`
          ),
          {
            name: data.newItem.name,
            amount: data.newItem.amount,
            updatedAt: new Date(),
          }
        );
      } else {
        await updateDoc(
          doc(
            db,
            `projects/${projectId}/sections/${section.id}/items/${editingItemId}`
          ),
          {
            name: data.newItem.name,
            amount: data.newItem.amount,
            updatedAt: new Date(),
          }
        );
      }
      setEditingItemId(null);
    } else {
      // Add new item
      if (projectId === "B91ZvtvPvg2GGoKixLS0") {
        await addDoc(
          collection(db, `expenses/${projectId}/sections/${section.id}/items`),
          {
            name: data.newItem.name,
            amount: data.newItem.amount,
            createdAt: new Date(),
          }
        );
      } else {
        await addDoc(
          collection(db, `projects/${projectId}/sections/${section.id}/items`),
          {
            name: data.newItem.name,
            amount: data.newItem.amount,
            createdAt: new Date(),
          }
        );
      }
    }

    reset({ ...getValues(), newItem: { name: "", amount: 0.0 } });
    onUpdated();
  };

  const onRemoveItem = async (itemId: string) => {
    await deleteDoc(
      doc(db, `projects/${projectId}/sections/${section.id}/items/${itemId}`)
    );
    onUpdated();
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2 mb-2">
        <input
          {...register("sectionName", { required: true })}
          className="border-2 border-black px-2 py-1 rounded w-2/3"
        />
        <div className="flex items-center gap-2">
          {isExpanded && (
            <button
              onClick={onSaveSectionName}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Save
            </button>
          )}

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-sm text-gray-600 hover:underline"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>
      {isExpanded && (
        <>
          <ul className="space-y-2 mb-4">
            {watch("items").map((item, idx) => (
              <li
                key={idx}
                className="bg-gray-100 px-4 py-2 rounded flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">{item.name}</span> — $
                  {item.amount}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItemId(item.id);
                      setValue("newItem", {
                        name: item.name,
                        amount: item.amount,
                      });
                    }}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit(onAddItem)} className="flex gap-2 mb-4">
            <input
              {...register("newItem.name", { required: true })}
              placeholder="Item name"
              className="flex-1 border-2 border-black px-2 py-1 rounded"
            />
            <input
              {...register("newItem.amount", {
                required: true,
                valueAsNumber: true,
              })}
              placeholder="Amount"
              type="number"
              step="any"
              className="w-32 border-2 border-black px-2 py-1 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              + Add
            </button>
          </form>
        </>
      )}
    </div>
  );
};
