import {
  Body,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

import type { users } from "@ryuu/db/schema";

import { baseUrl } from "../constants";

interface SignInProps {
  user?: typeof users.$inferSelect;
  token: string;
  city?: string;
  country?: string;
  ip?: string;
}

export function SignIn({ user, token, city, country, ip }: SignInProps) {
  // TODO: Make this page in the web app.
  const url = String(new URL(`/sign-in/confirm/${token}`, baseUrl));

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify your email to sign in to Ryuu</title>
      </Head>
      <Body>
        <Preview>Verify your email to sign in to Ryuu</Preview>
        <Section>
          <Row>
            <Column align="center">
              <Section
                width={600}
                style={{
                  border: "1px solid #eaeaea",
                  borderRadius: "5px",
                  margin: "40px 0",
                  padding: "40px",
                }}
              >
                <Row>
                  <Column align="center">
                    <div
                      style={{
                        fontFamily: font,
                        textAlign: "left",
                        width: "465px",
                      }}
                    >
                      <Section>
                        <Row>
                          <Column align="center">
                            <div>
                              <Img
                                src={String(
                                  new URL("/assets/logo.png", baseUrl),
                                )}
                                width={48}
                                height={48}
                                alt="Create Ryuu App"
                              />
                            </div>
                            <Heading
                              style={{
                                color: "#000000",
                                fontFamily: font,
                                fontSize: "24px",
                                fontWeight: "normal",
                                margin: "30px 0",
                                padding: "0",
                              }}
                            >
                              Verify your email to sign in to <b>Ryuu</b>
                            </Heading>
                          </Column>
                        </Row>
                      </Section>
                      {user && (
                        <>
                          <Text
                            style={{
                              color: "#000000",
                              fontFamily: font,
                              fontSize: "14px",
                              lineHeight: "24px",
                            }}
                          >
                            Hello <b>{user.username}</b>,
                          </Text>
                          <br />
                        </>
                      )}
                      <Text
                        style={{
                          color: "#000000",
                          fontFamily: font,
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        We have recieved a sign up attempt from{" "}
                        {city && country
                          ? `${city}, ${country}`
                          : "an unknown location"}
                        , using{" "}
                        {ip ? `the IP address ${ip}` : "an unknown IP address"}.
                      </Text>
                      <br />
                      <Text
                        style={{
                          color: "#000000",
                          fontFamily: font,
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        To complete the sign in process, please click on the
                        button below.
                      </Text>
                      <br />
                      <Section>
                        <Row>
                          <Column align="center">
                            <div>
                              <Link
                                href={url}
                                target="_blank"
                                style={{
                                  display: "inline-block",
                                  width: "200px",
                                  backgroundColor: "#000000",
                                  borderRadius: "5px",
                                  color: "#ffffff",
                                  fontFamily: font,
                                  fontWeight: "500",
                                  fontSize: "12px",
                                  lineHeight: "50px",
                                  textAlign: "center",
                                  textDecoration: "none",
                                  WebkitTextSizeAdjust: "none",
                                }}
                              >
                                VERIFY
                              </Link>
                            </div>
                          </Column>
                        </Row>
                      </Section>
                      <br />
                      <Text
                        style={{
                          color: "#000000",
                          fontFamily: font,
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        Or copy and paste this URL into a new tab of your
                        browser:
                      </Text>
                      <Text
                        style={{
                          color: "#000000",
                          fontFamily: font,
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        <Link
                          href={url}
                          target="_blank"
                          style={{
                            color: "#067df7",
                            textDecoration: "none",
                          }}
                        >
                          {url}
                        </Link>
                      </Text>
                      <br />
                      <Hr
                        style={{
                          border: "none",
                          borderTop: "1px solid #eaeaea",
                          margin: "26px 0",
                          width: "100%",
                        }}
                      />
                      <Text
                        style={{
                          color: "#666666",
                          fontFamily: font,
                          fontSize: "12px",
                          lineHeight: "24px",
                        }}
                      >
                        If you didn't attempt to sign up but received this
                        email, or if the location doesn't match, please ignore
                        this email. If you are concerned about your account's
                        safety, please visit{" "}
                        <Link
                          href={String(new URL("/help", baseUrl))}
                          target="_blank"
                          style={{
                            color: "#067df7",
                            textDecoration: "none",
                          }}
                        >
                          our Help page
                        </Link>{" "}
                        to get in touch with us.
                      </Text>
                    </div>
                  </Column>
                </Row>
              </Section>
            </Column>
          </Row>
        </Section>
      </Body>
    </Html>
  );
}

const font =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';
