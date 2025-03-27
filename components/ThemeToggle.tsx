"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";

const ModeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      variant="light"
      size="lg"
      onClick={toggleColorScheme}
      aria-label="Toggle theme"
    >
      {colorScheme === "dark" ? (
        <IconSunFilled size={18} />
      ) : (
        <IconMoonFilled size={18} />
      )}
    </ActionIcon>
  );
};
export default ModeToggle;
