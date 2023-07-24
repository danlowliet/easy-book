"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  children: React.ReactNode;
  title: string;
  description: string;
  isOpen: boolean;
  onChange: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  title,
  description,
  isOpen,
  onChange,
}) => (
  <Dialog.Root
    open={isOpen}
    defaultOpen={isOpen}
    onOpenChange={onChange}
    modal={true}
  >
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-neutral-900/90 backdrop-blur-sm" />
      <Dialog.Content
        className="
            fixed 
            drop-shadow-md 
            border 
            border-neutral-700 
            top-[50%] 
            left-[50%] 
            max-h-full 
            h-full 
            md:h-auto 
            md:max-h-[85vh] 
            w-full 
            md:w-[90vw] 
            md:max-w-[450px] 
            translate-x-[-50%] 
            translate-y-[-50%] 
            rounded-md 
            bg-white
            p-[25px] 
            focus:outline-none
          "
      >
        <Dialog.Title
          className="
              text-xl 
              text-center 
              font-bold 
              mb-4
            "
        >
          {title}
        </Dialog.Title>
        <Dialog.Description
          className="
              mb-5 
              text-sm 
              leading-normal 
              text-center
            "
        >
          {description}
        </Dialog.Description>
        <div>{children}</div>
        <Dialog.Close asChild>
          <button
            className="
                text-neutral-400 
                hover:text-white 
                absolute 
                top-[10px] 
                right-[10px] 
                inline-flex 
                h-[25px] 
                w-[25px] 
                appearance-none 
                items-center 
                justify-center 
                rounded-full 
                focus:outline-none
              "
            aria-label="Close"
          >
            <IoMdClose />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Modal;
