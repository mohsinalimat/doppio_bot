import * as React from "react";

import {
  Flex,
  Text,
  SkeletonText,
  Table,
  Thead,
  Tbody,
  TableContainer,
  Tr,
  Td,
  Th,
} from "@chakra-ui/react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import CopyToClipboardButton from "./CopyToClipboardButton";

const Pre = (props) => {
  const { codeString, ...otherProps } = props;

  return (
    <div
      role="group"
      {...otherProps}
      style={{ ...otherProps.style, position: "relative" }}
    >
      {otherProps.children}
      <CopyToClipboardButton contentToCopy={codeString} />
    </div>
  );
};

const Message = ({ message }) => {
  const fromAI = message.from === "ai";
  return (
    <Flex
      direction={"column"}
      p={"4"}
      key={message.content}
      alignSelf={fromAI ? "start" : "end"}
      justify={"center"}
      backgroundColor={fromAI ? "blackAlpha.800" : "linkedin.500"}
      rounded={"xl"}
      width={"fit-content"}
      maxW={{ base: "100%", sm: "55%" }}
      roundedTopLeft={fromAI ? "0" : "xl"}
      roundedTopRight={fromAI ? "xl" : "0"}
    >
      {!message.isLoading ? (
        <ReactMarkdown
          children={message.content}
          components={{
            p: ({ node, ...props }) => <Text color="white" mb="0" {...props} />,
            table: ({ node, ...props }) => (
              <TableContainer bg={"white"} mt="1.5" rounded="sm">
                <Table p={"1"} size={"sm"} variant={"simple"} {...props} />
              </TableContainer>
            ),
            thead: ({ node, ...props }) => <Thead {...props} />,
            tbody: ({ node, ...props }) => <Tbody {...props} />,
            tr: ({ node, ...props }) => <Tr {...props} />,
            td: ({ node, ...props }) => <Td {...props} />,
            th: ({ node, ...props }) => <Th {...props} />,
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");
              return !inline && match ? (
                <SyntaxHighlighter
                  {...props}
                  children={codeString}
                  style={atomDark}
                  language={match[1]}
                  PreTag={(props) => <Pre codeString={codeString} {...props} />}
                />
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            },
          }}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        />
      ) : (
        <SkeletonText
          maxWidth="100%"
          width="20"
          noOfLines={1}
          spacing="4"
          skeletonHeight="2"
        />
      )}
    </Flex>
  );
};

export default Message;
