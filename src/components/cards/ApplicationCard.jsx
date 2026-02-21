/**
 * ApplicationCard component
 * @param {{app: import('../../../types/Types.js').JobApplication, onMoveLeft: function, onMoveRight: function, isFirst?: boolean, isLast?: boolean, draggableProps?: object, dragHandleProps?: object, innerRef?: any}} props
 */

import React from 'react';
import { Box, Card, CardContent, Avatar, Chip, Button, CardHeader, Stack, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CARD } from './styles/applicationCardStyles';

export default function ApplicationCard({ app, onMoveLeft, onMoveRight, isFirst = false, isLast = false, draggableProps, dragHandleProps, innerRef }) {
  return (
    <Card variant="outlined" sx={CARD.root} ref={innerRef} {...draggableProps} {...dragHandleProps}>
      <CardHeader
        sx={CARD.header}
        avatar={<Avatar src={app.companyLogo} alt={app.companyName} sx={CARD.avatar} />}
        title={<Typography variant="subtitle1" sx={CARD.title}>{app.jobTitle}</Typography>}
        subheader={<Typography variant="body2" sx={CARD.subheader}>{app.companyName}</Typography>}
        action={
          <Box sx={CARD.action}>
            <Button size="small" onClick={() => onMoveLeft(app.id)} startIcon={<ArrowBackIosNewIcon />} disabled={isFirst} />
            <Button size="small" onClick={() => onMoveRight(app.id)} endIcon={<ArrowForwardIosIcon />} disabled={isLast} />
          </Box>
        }
      />
      <CardContent sx={CARD.content}>
        <Stack direction="row" spacing={1} sx={CARD.chipRow}>
          {(app.tags || []).slice(0, 5).map((t) => (
            <Chip key={t} label={t} size="small" sx={CARD.tag} />
          ))}
        </Stack>
        <Typography variant="caption" sx={CARD.locationText}>
          {app.location ? `${app.location} • ${app.workType}` : app.workType}
        </Typography>
        <Box sx={CARD.metaRow}>
          <Typography variant="caption" sx={CARD.metaText}>{app.platform || ''}</Typography>
          <Typography variant="caption" sx={CARD.metaText}>{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : ''}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
