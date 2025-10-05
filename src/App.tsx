import { NotificationProvider } from "../src/context/NotificationContext";
import "../src/components/NotificationToast.css";
import "../src/components/NotificationContainer.css";
import DemoContent from "./pages/Demo";

function App() {
  return (
    <NotificationProvider
      position="bottom-left"
      maxNotifications={5}
      animation="slide"
      enableStacking={true}
      stackingOffset={10}
      defaultDuration={3000}
    >
      <DemoContent />
    </NotificationProvider>
  );
}

export default App;
