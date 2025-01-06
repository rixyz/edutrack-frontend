import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import NavBar from "./NavBar";

const Layout = () => {
  const [openHeader, { toggle: toggleHeader }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 57 }}
      navbar={{
        width: 270,
        breakpoint: "sm",
        collapsed: { mobile: !openHeader },
      }}
      withBorder={false}
    >
      <AppShell.Header>
        <Header openHeader={openHeader} toggleHeader={toggleHeader} />
      </AppShell.Header>

      <AppShell.Navbar>
        <NavBar toggleHeader={toggleHeader} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
