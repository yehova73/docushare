import { EmailContainer } from "./email-container";
import { emailStyles } from "./styles";
import { Text } from "@react-email/components";

export type ReminderEmailProps = {
  title: string;
  content: string;
  unsubscribeUrl?: string;
};

export default function ReminderEmail({
  title,
  content,
  unsubscribeUrl,
}: ReminderEmailProps) {
  return (
    <EmailContainer
      title={title}
      preview={content}
      reason="You are receiving this message because a document request needs your attention."
      unsubscribeUrl={unsubscribeUrl}
      hideUnsubscribe
    >
      <Text style={emailStyles.text}>{content}</Text>
    </EmailContainer>
  );
}
