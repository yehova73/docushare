import { CSSProperties } from "react";

const primaryColor = "#3F31DB";
export const emailStyles = {
  main: {
    backgroundColor: "#f6f9fc",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "40px auto",
    marginBottom: "64px",
    width: "100%",
    maxWidth: "640px",
    borderRadius: 20,
    boxSizing: "border-box" as CSSProperties["boxSizing"],
  },
  content: {
    paddingLeft: 40,
    paddingRight: 40,
    maxWidth: "100%",
    boxSizing: "border-box" as CSSProperties["boxSizing"],
  },
  logoContainer: {
    backgroundColor: "#050505",
    color: primaryColor,
    paddingTop: 60,
    paddingLeft: 40,
    paddingBottom: 12,
    margin: 0,
    width: "100%",
    maxWidth: "640px",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    boxSizing: "border-box" as CSSProperties["boxSizing"],
  },
  logoText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
  },
  button: {
    background: primaryColor,
    color: "#ffffff",
    fontWeight: "700",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 24,
    borderRadius: 8,
    width: "100%",
    textAlign: "center" as CSSProperties["textAlign"],
    boxSizing: "border-box" as CSSProperties["boxSizing"],
  },
  text: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#111827",
  },

  hr: {
    borderColor: "#E5E7EB",
    margin: "24px 0",
  },
  footer: {
    fontSize: "12px",
    lineHeight: "1.5",
    color: "#6B7280",
    marginTop: "16px",
  },
  listItem: {
    paddingLeft: 12,
    borderLeft: `4px solid`,
    borderColor: primaryColor,
    marginBottom: 12,
  },
  listItemTitle: {
    fontSize: "14px",
    fontWeight: "600",
    marginTop: "0px",
    marginBottom: "0px",
  },
  listItemDescription: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#111827",
    marginBottom: 4,
    marginTop: 0,
  },
  subtitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    marginTop: 0,
  },
  link: {
    color: "#0662adff",
    textDecoration: "underline",
    cursor: "pointer",
  },
};
