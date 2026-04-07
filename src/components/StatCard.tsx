import React from 'react';
import { Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string;
  helpText: string;
  type?: 'increase' | 'decrease';
}

const StatCard = ({ label, value, helpText, type = 'increase' }: StatCardProps) => {
  return (
    <Box
      as={motion.div}
      whileHover={{ y: -5 }}
      bg="dark.card"
      p={6}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="dark.border"
      boxShadow="xl"
    >
      <Stat>
        <StatLabel color="gray.400" fontSize="sm">{label}</StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold" mt={1}>{value}</StatNumber>
        <StatHelpText mb={0}>
          <StatArrow type={type} />
          {helpText}
        </StatHelpText>
      </Stat>
    </Box>
  );
};

export default StatCard;
