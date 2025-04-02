"use client";
import {
  counties as allCounties,
  stateAbbreviations,
  states,
} from "@/app/(public)/_components/us-datas";
import { LocationContext } from "@/components/LocationProvider";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Menu,
  Modal,
  rgba,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconChevronDown,
  IconMapPin,
  IconMenu2,
  IconPencil,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Navbar() {
  const [isMenuOpen, { toggle: toggleMenu }] = useDisclosure(false);
  const { location, setManualLocation, updateLocation } =
    useContext(LocationContext) || {};
  const [selectedState, setSelectedState] = useState<string>(
    location?.state || ""
  );

  const [isModalOpen, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [counties, setCounties] = useState<string[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [aboutDropdownOpen, { toggle: toggleAboutDropdown }] =
    useDisclosure(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleStateChange = (value: string | null) => {
    setSelectedState(value || "");
    setSelectedCounty("");
  };

  const handleCountyChange = (value: string | null) => {
    setSelectedCounty(value || ""); // Set county to an empty string if null
  };

  const handleUpdateLocation = () => {
    if (setManualLocation) {
      const newLocation = {
        latitude: 0,
        longitude: 0,
        region: location?.region || "",
        state: selectedState || undefined,
        country: "United States",
        county: selectedCounty || undefined,
      };
      setManualLocation(newLocation);
    }
    closeModal();
    window.location.reload();
  };

  const handleUpdateAutomatically = () => {
    if (updateLocation) {
      updateLocation();
    }
    closeModal();
    window.location.reload();
  };

  useEffect(() => {
    if (isModalOpen && location) {
      setSelectedState(location.state || "");
      setSelectedCounty(location.county || "");
    }
  }, [isModalOpen, location]);

  useEffect(() => {
    if (selectedState) {
      const stateCounties = allCounties[selectedState] || [];
      setCounties(stateCounties);
    } else {
      setCounties([]);
    }
  }, [selectedState]);

  return (
    <>
      <Box
        component="nav"
        style={(theme) => ({
          backgroundColor: theme.colors.dark[9],
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 50,
        })}
      >
        <Box
          style={{
            width: "100%",
            maxWidth: "1024px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
          }}
        >
          {/* Brand / Logo */}
          <Box
            style={{
              display: "none",
              "@media (min-width: 640px)": { display: "block" }, // `sm` breakpoint in Tailwind
            }}
          >
            <Link href="/">
              <Image
                src="/logowhite.png"
                alt="MyApp Logo"
                width={200}
                height={200}
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </Link>
          </Box>

          {/* Location Selector */}
          <Group
            onClick={openModal}
            style={(theme) => ({
              display: "flex",
              alignItems: "center",
              backgroundColor: rgba(theme.colors.dark[8], 0.75), // Use `rgba()` directly
              padding: "8px",
              borderRadius: "8px",
              cursor: "pointer",
              margin: "20px",
              "&:hover": {
                backgroundColor: theme.colors.dark[7],
              },
            })}
          >
            <IconMapPin
              color="#34D399"
              size={16}
              style={{ marginRight: "8px" }}
            />
            <Text size="sm" color="white">
              {location?.county
                ? `${location.county}, ${
                    stateAbbreviations[location.state ?? ""]
                  }`
                : location?.state
                ? stateAbbreviations[location.state]
                : "United States"}
            </Text>
            <ActionIcon
              onClick={openModal}
              size="xs"
              style={(theme) => ({
                marginLeft: "8px",
                backgroundColor: theme.colors.dark[6],
                color: "white",
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: theme.colors.blue[7],
                },
              })}
              aria-label="Edit Location"
            >
              <IconPencil size={12} />
            </ActionIcon>
          </Group>

          {/* Hamburger button for small screens */}
          {isMobile && (
            <Group gap="lg">
              <ActionIcon color="white" onClick={toggleMenu} hiddenFrom="md">
                <IconMenu2 size={24} />
              </ActionIcon>
            </Group>
          )}

          {/* Links for larger screens */}
          <Group gap="lg" visibleFrom="md">
            <Link href="/">
              <Text
                component="a"
                color="white"
                style={{ "&:hover": { opacity: 0.8 } }}
              >
                Home
              </Text>
            </Link>

            <Link href="/about-us">
              <Text
                component="a"
                c="white"
                style={{ "&:hover": { opacity: 0.8 } }}
              >
                About Us
              </Text>
            </Link>

            {/* Learn More dropdown */}
            <Menu
              position="bottom"
              withArrow
              opened={aboutDropdownOpen}
              onChange={toggleAboutDropdown}
            >
              <Menu.Target>
                <Button
                  variant="filled"
                  color="dark"
                  size="sm"
                  style={{
                    "&:hover": { backgroundColor: "dark.7" },
                    "&[data-expanded]": { backgroundColor: "dark.7" },
                  }}
                >
                  Learn More
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      marginLeft: "8px",
                    }}
                  >
                    <IconChevronDown
                      size={16}
                      style={{
                        transition: "transform 200ms",
                        transform: aboutDropdownOpen
                          ? "rotate(180deg)"
                          : "none",
                      }}
                    />
                  </span>
                </Button>
              </Menu.Target>

              <Menu.Dropdown style={{ backgroundColor: "dark.9" }}>
                <Menu.Item component={Link} href="/work-in-climate-area">
                  Work in the Climate Area
                </Menu.Item>
                <Menu.Item component={Link} href="/learn-more">
                  Learn More
                </Menu.Item>
                <Menu.Item component={Link} href="/follow-people">
                  Follow Key People
                </Menu.Item>
                <Menu.Item component={Link} href="/learn-a-lot-more">
                  Learn a Lot More
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Box>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <Box
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
            }}
          >
            <ActionIcon
              onClick={toggleMenu}
              size="lg"
              color="white"
              style={{ alignSelf: "flex-end" }}
            >
              <IconX size={24} />
            </ActionIcon>
            <Link href="/">
              <Text
                component="a"
                c="white"
                style={{ "&:hover": { opacity: 0.7 } }}
              >
                Home
              </Text>
            </Link>
            <Link href="/about-us">
              <Text
                component="a"
                c="white"
                style={{ "&:hover": { opacity: 0.7 } }}
              >
                About Us
              </Text>
            </Link>
            <Link href="/follow-people">
              <Text
                component="a"
                c="white"
                style={{ "&:hover": { opacity: 0.7 } }}
              >
                Follow Key People
              </Text>
            </Link>
            <Link href="/work-in-climate-area">
              <Text
                component="a"
                c="white"
                style={{ "&:hover": { opacity: 0.7 } }}
              >
                Work in the Climate Area
              </Text>
            </Link>
            <Link href="/learn-more">
              <Text
                component="a"
                c="white"
                style={{ "&:hover": { opacity: 0.7 } }}
              >
                Learn More
              </Text>
            </Link>
            <Link href="/learn-a-lot-more">
              <Text
                component="a"
                c="white"
                style={{ "&:hover": { opacity: 0.7 } }}
              >
                Learn a Lot More
              </Text>
            </Link>
          </Box>
        )}
      </Box>

      {/* Modal */}
      <Modal
        opened={isModalOpen}
        onClose={closeModal}
        centered
        overlayProps={{ opacity: 0.5, blur: 4 }}
        size={isMobile ? "90%" : "md"}
        withCloseButton={false}
      >
        <Stack gap="lg">
          <Text size="lg" w={600}>
            Update Location
          </Text>

          <Select
            label="State"
            placeholder="Select State"
            data={states.map((state) => ({ value: state, label: state }))}
            value={selectedState}
            onChange={handleStateChange}
          />

          <Select
            label="County"
            placeholder="Select County"
            data={counties.map((county) => ({ value: county, label: county }))}
            value={selectedCounty}
            onChange={handleCountyChange}
            disabled={!selectedState}
          />

          <Button
            variant="outline"
            color="green.6"
            onClick={handleUpdateAutomatically}
          >
            Update Automatically
          </Button>

          <Button color="blue.6" onClick={handleUpdateLocation}>
            Save
          </Button>

          <Button variant="default" onClick={closeModal}>
            Cancel
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
