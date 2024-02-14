import React, { useRef } from "react";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Position } from "../common/types";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  closeModal?: () => void;
  children: React.ReactElement;
  position?: Position | null;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  closeModal,
  position,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  function onMouseLeave() {
    if (closeModal) {
      closeModal();
    }
  }
  return (
    // When using <Transition> with your dialogs, you can remove the 'open' prop, as the dialog will read the 'show' state from the <Transition> automatically.
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        {/* this is backdrop(on full screen) */}

        <div className="fixed inset-0  overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
              afterEnter={() => {
                panelRef.current?.addEventListener("mouseleave", onMouseLeave);
              }}
              // once dialog panel is opened , we add this eventlistener(if we move mouse out of panel , it should close )

              afterLeave={() => {
                panelRef.current?.removeEventListener(
                  "mouseleave",
                  onMouseLeave,
                );
              }}
            >
              {/* afterEnter : Callback which is called after we finished the enter transition. */}
              {/* afterLeave : Callback which is called after we finished the leave transition. */}
              {/* https://headlessui.com/react/transition */}

              <Dialog.Panel
                ref={panelRef}
                className=" transform overflow-hidden rounded-2xl  bg-dark text-left align-middle shadow-xl transition-all"
                style={position ? { position: "fixed", ...position } : {}}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// from documentation:
// to show and hide your dialog, pass React state into the 'open' prop. When 'open' is true the dialog will render, and when it's false the dialog will unmount.
// The 'onClose' callback fires when an open dialog is dismissed, which happens when the user clicks outside the your Dialog.Panel or presses the Escape key. You can use this callback to set 'open' back to false and close your dialog.
// When using <Transition> with your dialogs, you can remove the 'open' prop, as the dialog will read the 'show' state from the <Transition> automatically.
// Style the Dialog and Dialog.Panel components using the 'className' or 'style' props like you would with any other element
