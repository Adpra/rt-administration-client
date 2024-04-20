import { Portal } from "@headlessui/react";
import BaseLoading from "./BaseLoading";

const LoadingScreen = () => {
  return (
    <Portal>
      <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white bg-opacity-90">
        <BaseLoading size="lg" color="primary" />
        {/* <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div> */}
      </div>
    </Portal>
  );
};

export default LoadingScreen;
