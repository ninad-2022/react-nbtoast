import { useNotification } from "../hooks/useNotification";

function DemoContent() {
  const notification = useNotification();

  return (
    <div style={{ padding: "40px", fontFamily: "system-ui, sans-serif" }}>
      <h1>React Notify Toast - Demo</h1>
      <p>Test the notification system with different configurations</p>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <button
          onClick={() =>
            notification.success("Operation completed successfully!")
          }
          style={buttonStyle}
        >
          Success
        </button>

        <button
          onClick={() =>
            notification.error("An error occurred. Please try again.", {
              title: "Error",
            })
          }
          style={buttonStyle}
        >
          Error
        </button>

        <button
          onClick={() =>
            notification.warning("This action cannot be undone.", {
              title: "Warning",
            })
          }
          style={buttonStyle}
        >
          Warning
        </button>

        <button
          onClick={() =>
            notification.info("You have 5 new messages.", {
              title: "Info",
            })
          }
          style={buttonStyle}
        >
          Info
        </button>

        <button
          onClick={() => {
            const id = notification.loading("Processing your request...");
            setTimeout(() => {
              notification.update(id, {
                type: "success",
                message: "Request completed!",
                duration: 3000,
              });
            }, 3000);
          }}
          style={buttonStyle}
        >
          Loading → Success
        </button>

        <button
          onClick={() =>
            notification.success("File uploaded successfully!", {
              action: {
                label: "View",
                onClick: () => alert("Opening file..."),
              },
            })
          }
          style={buttonStyle}
        >
          With Action
        </button>

        <button
          onClick={() =>
            notification.info("This notification will stay for 10 seconds", {
              duration: 10000,
            })
          }
          style={buttonStyle}
        >
          Long Duration
        </button>

        <button
          onClick={() => {
            for (let i = 1; i <= 5; i++) {
              setTimeout(() => {
                notification.success(`Notification ${i} of 5`);
              }, i * 500);
            }
          }}
          style={buttonStyle}
        >
          Multiple (Stacking)
        </button>

        <button
          onClick={() =>
            notification.success("Custom styled notification", {
              customStyles: {
                container: {
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                },
                title: { color: "#ffffff" },
                message: { color: "#f3f4f6" },
              },
            })
          }
          style={buttonStyle}
        >
          Custom Style
        </button>

        <button
          onClick={() => notification.dismissAll()}
          style={dangerButtonStyle}
        >
          Dismiss All
        </button>
      </div>
    </div>
  );
}
export default DemoContent;

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: 500,
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  background: "#000000ff",
  cursor: "pointer",
  transition: "all 0.2s",
};

const dangerButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#ef4444",
  color: "#ffffff",
  border: "none",
};