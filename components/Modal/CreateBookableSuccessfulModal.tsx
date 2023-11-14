import useComputeBookableSharableLink from "@/hooks/useComputeShareableLink";
import { Bookable } from "@/lib/models";
import { computeBookableShareableLink } from "@/lib/utils";
import {
  Button,
  CopyButton,
  Flex,
  Group,
  Input,
  Modal,
  Stack,
  Title,
  Text,
  useMantineTheme,
} from "@mantine/core";

import { IconCircleCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { ComponentProps, FC } from "react";

const CreateBookableSuccessfulModal: FC<
  ComponentProps<typeof Modal> & {
    bookable: Bookable | null;
  }
> = ({ bookable, ...props }) => {
  const theme = useMantineTheme();
  const router = useRouter();

  const { link } = useComputeBookableSharableLink(bookable?.id ?? "");
  return (
    <Modal {...props}>
      <Stack gap={4} align="center">
        <IconCircleCheck color={theme.colors.green[6]} size={56} />

        <Title style={{ textAlign: "center" }} order={3}>
          Booking link created
        </Title>
        <Text>Share this link to book a time slot with this event</Text>
      </Stack>

      <Group mt={12}>
        <Input
          value={link}
          disabled
          style={{
            flex: 1,
          }}
        />
        <CopyButton value={link}>
          {({ copied, copy }) => (
            <Button
              color={copied ? "teal" : "blue"}
              onClick={() => {
                copy();
                props.onClose();
              }}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          )}
        </CopyButton>
      </Group>
    </Modal>
  );
};
export default CreateBookableSuccessfulModal;
