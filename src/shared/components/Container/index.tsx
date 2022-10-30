import { Box, BoxProps } from "@theme-ui/components";
import React from "react";
import { Flex } from "theme-ui";

const SHARED_PADDING = [3, null, null, null, null, 0];

const Container: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      px={SHARED_PADDING}
      mx="auto"
      sx={{ position: "relative", maxWidth: 1440, width: "100%" }}
      {...props}
    >
      <Flex
        sx={{
          height: "100vh",
          justifyContent: "center",
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {children}
      </Flex>
    </Box>
  );
};

export default Container;
