import { toast, ToastContainer, Flip } from 'react-toastify';
import { PiStudentBold } from 'react-icons/pi';

const baseOptions = {
  position: "bottom-right",
  autoClose: 4000,
  pauseOnHover: true,
  draggable: true,
  transition: Flip,
};

export const showReviewerToast = (message, type = "warning") => {
  toast(
    <div className="flex items-center gap-2">
      <PiStudentBold size={20} className="text-blue-500" />
      <span>
        <strong>NOTICE</strong> {message}
      </span>
    </div>,
    { ...baseOptions, type, theme: "dark"}
  );
};

export const ReviewerToastContainer = () => (
  <ToastContainer limit={3} newestOnTop closeButton theme="dark" />
);