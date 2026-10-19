import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { authenticateUser } from "../../../app/container";
import entrepreneurImage from "../../../shared/assets/auth/entrepreneur.webp";
import { BrandLogo } from "../../../shared/components/BrandLogo";
import type { User } from "../../users/domain/User";
import type {
  LoginCredentials,
  LoginFieldErrors,
} from "../application/authenticateUser";
import { useAuthStore } from "../state/useAuthStore";

const LOGIN_DELAY_MS = 1000;
const FADE_OUT_MS = 250;
const initialCredentials: LoginCredentials = { email: "", password: "" };

export function LoginPage() {
  const startSession = useAuthStore((state) => state.startSession);
  const [credentials, setCredentials] =
    useState<LoginCredentials>(initialCredentials);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [credentialsError, setCredentialsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const pendingUser = useRef<User | null>(null);
  const loginTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(loginTimer.current), []);

  const updateField = (field: keyof LoginCredentials, value: string) => {
    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [field]: value,
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
    setCredentialsError(false);
  };

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    const result = authenticateUser.execute(credentials);

    if (result.kind === "validation-error") {
      setFieldErrors(result.fieldErrors);
      return;
    }
    if (result.kind === "invalid-credentials") {
      setCredentialsError(true);
      return;
    }

    pendingUser.current = result.user;
    setIsSubmitting(true);
    loginTimer.current = window.setTimeout(
      () => setIsLeaving(true),
      LOGIN_DELAY_MS,
    );
  };

  // La sesión se inicia al terminar el fundido; RedirectAuthenticated lleva al usuario a /home.
  const finishLogin = () => {
    if (pendingUser.current) {
      startSession(pendingUser.current);
      pendingUser.current = null;
    }
  };

  return (
    <Fade in={!isLeaving} timeout={FADE_OUT_MS} onExited={finishLogin}>
      <Box
        sx={{
          minHeight: "100dvh",
          display: "grid",
          alignItems: "center",
          overflow: "hidden",
          py: { xs: 2, md: 4 },
          background:
            "radial-gradient(circle at 5% 8%, rgba(198, 247, 42, 0.3), transparent 22rem), radial-gradient(circle at 95% 92%, rgba(246, 5, 99, 0.14), transparent 26rem), #fff9fc",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.08fr 0.92fr" },
              borderRadius: { xs: 3, md: 4 },
              overflow: "hidden",
              boxShadow: "0 28px 70px rgba(86, 20, 63, 0.15)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: { xs: "flex-end", md: "space-between" },
                minHeight: { xs: 190, md: 590 },
                p: { xs: 2.5, md: 7 },
                color: "#ffffff",
                backgroundImage: {
                  xs: `linear-gradient(145deg, rgba(246, 5, 99, 0.58) 0%, rgba(216, 0, 86, 0.3) 55%, rgba(40, 19, 35, 0.55) 100%), url(${entrepreneurImage})`,
                  md: `linear-gradient(145deg, rgba(246, 5, 99, 0.78) 0%, rgba(216, 0, 86, 0.58) 51%, rgba(104, 0, 48, 0.72) 100%), url(${entrepreneurImage})`,
                },
                backgroundPosition: { xs: "center 36%", md: "center" },
                backgroundSize: "cover",
              }}
            >
              <Box
                sx={{
                  alignSelf: "flex-start",
                  filter: "drop-shadow(0 8px 12px rgba(0, 0, 0, 0.3))",
                }}
              >
                <BrandLogo compact />
              </Box>
              <Stack spacing={2.5} sx={{ display: { xs: "none", md: "flex" } }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 3,
                    bgcolor: "secondary.main",
                    color: "secondary.contrastText",
                  }}
                >
                  <StorefrontRoundedIcon fontSize="large" />
                </Box>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 800, maxWidth: 420 }}
                >
                  Tu emprendimiento merece ser visto.
                </Typography>
                <Typography
                  sx={{ maxWidth: 420, color: "rgba(255,255,255,0.84)" }}
                >
                  Chambea Pe es la vitrina digital para quienes hacen crecer el
                  Perú.
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  display: { xs: "none", md: "block" },
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                Hecho para emprendimientos peruanos.
              </Typography>
            </Box>

            <Paper
              square
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                p: { xs: 3, sm: 6, md: 7 },
                minHeight: { md: 590 },
              }}
            >
              <Box
                component="form"
                noValidate
                onSubmit={submitLogin}
                sx={{ width: "100%" }}
              >
                <Stack spacing={3}>
                  <Box>
                    <Typography component="h1" variant="h3" sx={{ mb: 1 }}>
                      Inicia sesión
                    </Typography>
                    <Typography color="text.secondary">
                      Ingresa para administrar tu espacio en Chambea Pe.
                    </Typography>
                  </Box>
                  {credentialsError && (
                    <Alert severity="error" role="alert">
                      Correo o contraseña incorrectos.
                    </Alert>
                  )}
                  <TextField
                    autoComplete="email"
                    autoFocus
                    disabled={isSubmitting}
                    error={Boolean(fieldErrors.email)}
                    fullWidth
                    helperText={fieldErrors.email}
                    id="email"
                    label="Correo electrónico"
                    name="email"
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    type="email"
                    value={credentials.email}
                  />
                  <TextField
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    error={Boolean(fieldErrors.password)}
                    fullWidth
                    helperText={fieldErrors.password}
                    id="password"
                    label="Contraseña"
                    name="password"
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    type="password"
                    value={credentials.password}
                  />
                  <Button
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    startIcon={<LoginRoundedIcon />}
                    type="submit"
                    variant="contained"
                  >
                    Ingresar
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Container>
        <Backdrop
          open={isSubmitting}
          sx={(theme) => ({
            zIndex: theme.zIndex.modal + 1,
            color: "#ffffff",
            flexDirection: "column",
            gap: 2,
          })}
        >
          <CircularProgress color="secondary" />
          <Typography aria-live="polite" sx={{ fontWeight: 700 }}>
            Iniciando sesión…
          </Typography>
        </Backdrop>
      </Box>
    </Fade>
  );
}
