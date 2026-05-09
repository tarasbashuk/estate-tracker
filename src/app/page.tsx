import { SignInButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Link from 'next/link';

export default async function HomePage() {
  const user = await currentUser();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 8,
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h3" component="h1">
            Estate Tracker
          </Typography>
          <Typography color="text.secondary">
            Private rental property management for properties, tenants,
            statements, payments, and operational tasks.
          </Typography>
          {user ? (
            <Link href="/properties">
              <Button variant="contained" size="large">
                Open dashboard
              </Button>
            </Link>
          ) : (
            <SignInButton mode="modal">
              <Button variant="contained" size="large">
                Sign in
              </Button>
            </SignInButton>
          )}
        </Stack>
      </Box>
    </Container>
  );
}
