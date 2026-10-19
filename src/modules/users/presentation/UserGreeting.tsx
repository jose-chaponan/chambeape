import { Typography } from "@mui/material";
import { getUserDisplayName } from "../application/getUserDisplayName";
import type { SessionUser } from "../domain/User";

interface UserGreetingProps {
  user: SessionUser;
}

export function UserGreeting({ user }: Readonly<UserGreetingProps>) {
  return (
    <Typography component="p" variant="body2" color="text.secondary">
      Sesión de {getUserDisplayName(user)}
    </Typography>
  );
}
