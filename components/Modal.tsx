"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  headline?: string;
  tagline?: string;
  copy?: string;
  color?: string;           // border top color
  bgColor?: string;         // panel background
  copyColor?: string;       // text color
  cancelText?: string;      // label for Cancel button
  confirmText?: string;     // label for Confirm button
  imgUrl?: string;          // optional image above copy
  onClose: () => void;
  onConfirm: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  headline = "I am a headline",
  tagline = "I am a tagline",
  copy = "I am a copy",
  color = "blue",
  bgColor = "white",
  copyColor = "black",
  cancelText = "Cancel",
  confirmText = "Confirm",
  imgUrl,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      />

      {/* modal panel */}
      <div
        className="rounded-lg shadow-xl z-10 w-11/12 max-w-md p-6"
        style={{
          borderTop: `4px solid ${color}`,
          backgroundColor: bgColor,
          color: copyColor,
        }}
      >
        <h2 className="text-2xl font-bold mb-2">{headline}</h2>
        <h3 className="text-lg font-semibold mb-4">{tagline}</h3>

        {imgUrl && (
          <img
            src={imgUrl}
            alt=""
            className="mb-4 w-full max-h-48 object-cover rounded"
          />
        )}

        <p className="text-base mb-6">{copy}</p>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
