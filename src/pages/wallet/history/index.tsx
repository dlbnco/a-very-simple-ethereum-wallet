import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import qs from "qs";
import Container from "../../../shared/components/Container";
import { Box, BoxProps, Button, Flex, Text } from "theme-ui";

import formatCryptoCurrency from "../../../wallet/utils/formatCryptoCurrency";

import BackButton from "../../../wallet/components/BackButton";
import alchemyHandler from "../../../alchemy/handler";

interface EtherScanTx {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value: number;
  erc721TokenId: null;
  erc1155Metadata: null;
  tokenId: null;
  asset: string;
  category: string;
  rawContract: { value: string; address: null; decimal: string };
  metadata: {
    blockTimestamp: string;
  };
}

interface Props {
  history: EtherScanTx[];
}

const ITEMS_PER_PAGE = 10;

const TableCell: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box
    p={2}
    sx={{
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      borderColor: "tertiary",
      borderWidth: "1px 0 0 1px",
      borderStyle: "solid",
    }}
    {...props}
  >
    <Text
      sx={{
        fontSize: 0,
      }}
      variant="monospace"
    >
      {children}
    </Text>
  </Box>
);

const HeaderCell: React.FC<BoxProps> = (props) => (
  <TableCell {...props} sx={{ borderColor: "secondary" }} />
);

const HistoryPage = (props: Props) => {
  const router = useRouter();
  const address = router.query.address as string;
  const page = Number((router.query.page as string) ?? 1);
  if (address == null) return null;
  return (
    <Container>
      <BackButton sx={{ mb: 3 }} />
      <Box sx={{ overflowX: "auto", maxWidth: "100%" }}>
        <Flex
          sx={{
            flexDirection: "column",
            minWidth: 1366,
          }}
        >
          <Flex
            bg="tertiary"
            sx={{
              borderColor: "secondary",
              borderWidth: "0 1px 1px 0",
              borderStyle: "solid",
            }}
          >
            <HeaderCell sx={{ flex: 1 / 2 }}>tx hash</HeaderCell>
            <HeaderCell sx={{ flex: 1 / 4.5 }}>height</HeaderCell>
            <HeaderCell sx={{ flex: 1 / 2 }}>date</HeaderCell>
            <HeaderCell>from</HeaderCell>
            <HeaderCell>to</HeaderCell>
            <HeaderCell sx={{ textAlign: "right", flex: 1 / 2.5 }}>
              value
            </HeaderCell>
          </Flex>
          <Box
            sx={{
              borderColor: "tertiary",
              borderWidth: "0 1px 1px 0",
              borderStyle: "solid",
            }}
          >
            {props.history.map((tx, index) => (
              <Flex key={`history-tx-${tx.hash}`}>
                <TableCell title={tx.hash} sx={{ flex: 1 / 2 }}>
                  {tx.hash}
                </TableCell>
                <TableCell sx={{ flex: 1 / 4.5 }}>
                  {parseInt(tx.blockNum, 16)}
                </TableCell>
                <TableCell sx={{ flex: 1 / 2 }}>
                  {new Date(tx.metadata.blockTimestamp).toLocaleString()}
                </TableCell>
                <TableCell>{tx.from}</TableCell>
                <TableCell>{tx.to}</TableCell>
                <TableCell sx={{ textAlign: "right", flex: 1 / 2.5 }}>
                  {formatCryptoCurrency({
                    value: tx.value,
                    symbol: "eth",
                    maximumDigits: 8,
                  })}
                </TableCell>
              </Flex>
            ))}
          </Box>
        </Flex>
      </Box>
      {page * ITEMS_PER_PAGE <= props.history.length && (
        <Link
          href={`${router.pathname}?${qs.stringify({
            ...router.query,
            page: page + 1,
          })}`}
          replace={true}
          sx={{ mt: 3 }}
        >
          <Button>Load more</Button>
        </Link>
      )}
    </Container>
  );
};

export default HistoryPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  const { url } = req;
  if (url == null) {
    return {
      props: {
        history: [],
      },
    };
  }
  const { address, page } = qs.parse(url.split("?")[1], {
    ignoreQueryPrefix: true,
  });

  const history = await alchemyHandler({
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: "0x0",
        toBlock: "latest",
        category: ["external"],
        withMetadata: true,
        excludeZeroValue: false,
        maxCount: "0x" + (ITEMS_PER_PAGE * Number(page ?? "1")).toString(16),
        fromAddress: "0x1370fcff4a5f7ac959d513c8db0e8acf223dccc3",
        order: "desc",
      },
    ],
  });
  console.log("history", history);
  return {
    props: {
      history: history.result.transfers,
    },
  };
};
