import { Skeleton, Group, Stack, Box } from '@mantine/core';

interface LoadingProps {
  type?: 'card' | 'page' | 'list' | 'detail';
  count?: number;
}

export const Loading: React.FC<LoadingProps> = ({ type = 'list', count = 3 }) => {
  if (type === 'card') {
    return (
      <Box style={{ width: '100%', height: '100%' }}>
        <Skeleton height={160} radius="md" mb="md" />
        <Skeleton height={20} radius="sm" width="70%" mb="xs" />
        <Skeleton height={14} radius="sm" width="90%" mb="xs" />
        <Skeleton height={14} radius="sm" width="60%" />
      </Box>
    );
  }

  if (type === 'page') {
    return (
      <Stack gap="lg" style={{ padding: '24px' }}>
        <Skeleton height={40} radius="md" width="40%" />
        <Group grow>
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
        </Group>
        <Skeleton height={400} radius="md" />
      </Stack>
    );
  }

  if (type === 'detail') {
    return (
      <Stack gap="lg" style={{ padding: '24px' }}>
        <Group justify="space-between">
          <Skeleton height={32} radius="sm" width="50%" />
          <Group>
            <Skeleton height={36} radius="md" width={80} />
            <Skeleton height={36} radius="md" width={80} />
          </Group>
        </Group>
        <Group grow>
          <Skeleton height={400} radius="md" />
          <Stack gap="md" style={{ flex: 1 }}>
            <Skeleton height={60} radius="md" />
            <Skeleton height={80} radius="md" />
            <Skeleton height={100} radius="md" />
          </Stack>
        </Group>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} height={100} radius="md" />
      ))}
    </Stack>
  );
};
