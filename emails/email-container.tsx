import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { emailStyles } from "./styles";

export const EmailContainer: React.FC<
  React.PropsWithChildren<{
    title: string;
    preview: string;
    reason: string;
    unsubscribeUrl?: string;
    hideUnsubscribe?: boolean;
  }>
> = ({ preview, title, reason, children, hideUnsubscribe, unsubscribeUrl }) => (
  <Html>
    <Head>
      <style>
        {`
       @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
          min-width: 100% !important;
          padding: 12px !important;
          margin: 0 auto !important;
          border-radius: 0 !important;
        }

        .email-content,
        .logo-container {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          padding-left: 12px !important;
          padding-right: 12px !important;
        }

        .logo-container {
          padding-top: 32px !important;
          padding-bottom: 12px !important;
          border-top-left-radius: 0 !important;
          border-top-right-radius: 0 !important;
        }

        .review-item {
          width: 100% !important;
          max-width: 100% !important;
          display: block !important;
        }
      }
    `}
      </style>
    </Head>
    <Preview>{preview}</Preview>
    <Body style={emailStyles.main}>
      <Container style={emailStyles.container} className="container">
        <Container style={emailStyles.logoContainer} className="logo-container">
          <table role="presentation" cellPadding="0" cellSpacing="0" border={0}>
            <tbody>
              <tr>
                <td style={{ verticalAlign: "middle", paddingRight: 8 }}>
                  <img
                    src="https://tabzo.app/logo.png"
                    alt="Tabzo Logo"
                    width="40"
                    height="40"
                    style={{ display: "block" }}
                  />
                </td>

                <td style={{ verticalAlign: "middle" }}>
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: "20px",
                      fontWeight: "700",
                      lineHeight: "24px",
                      margin: 0,
                    }}
                  >
                    Tabzo
                  </Text>

                  <Text
                    style={{
                      color: "#a1a1aa",
                      fontSize: "12px",
                      lineHeight: "16px",
                      margin: 0,
                    }}
                  >
                    Window & Tab Manager
                  </Text>
                </td>
              </tr>
            </tbody>
          </table>
        </Container>
        <Container style={emailStyles.content} className="email-content">
          <Heading>{title}</Heading>
          {children}
          {reason && (
            <Text
              style={{
                fontSize: "12px",
                color: "#999",
                marginTop: "24px",
                borderTop: "1px solid #eee",
                paddingTop: "8px",
              }}
            >
              {reason}
              <br />
              {!hideUnsubscribe && (
                <>
                  <Link
                    href={unsubscribeUrl || "https://fluxgate.app/unsubscribe"}
                    target="_blank"
                    style={{ color: "#999", textDecoration: "underline" }}
                  >
                    Unsubscribe
                  </Link>{" "}
                  |{" "}
                </>
              )}
              <Link
                href="https://fluxgate.app/#faq"
                target="_blank"
                style={{ color: "#999", textDecoration: "underline" }}
              >
                FAQ
              </Link>
            </Text>
          )}
        </Container>
      </Container>
    </Body>
  </Html>
);
