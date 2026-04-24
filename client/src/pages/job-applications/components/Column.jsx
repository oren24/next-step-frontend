import PropTypes from 'prop-types';
import { memo, useCallback, useMemo, useState } from 'react';
import { Box, Paper, Stack } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import AddApplicationModal from '../../../components/popapmodals/AddApplicationModal.jsx';
import { BOARD, STATUS_COLORS } from '../../styles/jobApplicationsStyles.js';
import { STATUS_ICONS } from '../constants/boardConstants.js';
import ColumnHeader from './ColumnHeader.jsx';
import DraggableItemWrapper from './DraggableItemWrapper.jsx';
import EmptyStateCard from './EmptyStateCard.jsx';

const ICON_STYLE_BY_STATUS = {
  Wishlist: BOARD.wishlistIcon,
  Applied: BOARD.appliedIcon,
  Interviewing: BOARD.interviewingIcon,
  Offer: BOARD.offerIcon,
  Rejected: BOARD.rejectedIcon,
};

const PLUS_ICON_STYLE_BY_STATUS = {
  Wishlist: BOARD.wishlistPlusIcon,
  Applied: BOARD.appliedPlusIcon,
  Interviewing: BOARD.interviewingPlusIcon,
  Offer: BOARD.offerPlusIcon,
  Rejected: BOARD.rejectedPlusIcon,
};

function Column({
  status,
  appsInColumn = [],
  statusOrder,
  updateAppStatus,
  onOpen,
  onRequestEdit,
  onRequestDelete,
  onShare,
  onAdd,
}) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { isOver, setNodeRef } = useDroppable({ id: status });

  const colors = STATUS_COLORS[status] || STATUS_COLORS.Wishlist;
  const iconStyle = ICON_STYLE_BY_STATUS[status];
  const plusIconStyle = PLUS_ICON_STYLE_BY_STATUS[status];
  const statusIcon = STATUS_ICONS[status];
  const isRejectedStatus = status === 'Rejected';
  const isEmpty = appsInColumn.length === 0;

  const sortableItemIds = useMemo(() => appsInColumn.map((app) => app.id), [appsInColumn]);

  const handleOpenAddModal = useCallback(() => {
    setAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setAddModalOpen(false);
  }, []);

  const handleSaveNewApp = useCallback(
    (newApp) => {
      onAdd(newApp);
      setAddModalOpen(false);
    },
    [onAdd]
  );

  return (
    <Paper elevation={1} sx={BOARD.columnPaper}>
      <ColumnHeader
        status={status}
        colors={colors}
        isRejectedStatus={isRejectedStatus}
        iconStyle={iconStyle}
        statusIcon={statusIcon}
        plusIconStyle={plusIconStyle}
        onAddClick={handleOpenAddModal}
      />

      <SortableContext items={sortableItemIds} strategy={rectSortingStrategy}>
        <Stack
          ref={setNodeRef}
          sx={{
            ...BOARD.columnStack,
            backgroundColor: colors.cardBg,
            ...(isOver ? BOARD.columnStackOver : {}),
            '--header-color': colors.header,
            '--card-bg': colors.cardBg,
          }}
        >
          {isEmpty ? (
            <EmptyStateCard
              status={status}
              colors={colors}
              iconStyle={iconStyle}
              statusIcon={statusIcon}
            />
          ) : (
            <>
              {appsInColumn.map((app) => (
                <DraggableItemWrapper
                  key={app.id}
                  app={app}
                  status={status}
                  statusOrder={statusOrder}
                  updateAppStatus={updateAppStatus}
                  onOpen={onOpen}
                  onRequestEdit={onRequestEdit}
                  onRequestDelete={onRequestDelete}
                  onShare={onShare}
                />
              ))}
              {isOver && <Box sx={BOARD.dropHint}>Drop here</Box>}
            </>
          )}
        </Stack>
      </SortableContext>

      <AddApplicationModal
        open={addModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewApp}
        status={status}
      />
    </Paper>
  );
}

Column.propTypes = {
  status: PropTypes.string.isRequired,
  appsInColumn: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })),
  statusOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateAppStatus: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  onRequestEdit: PropTypes.func,
  onRequestDelete: PropTypes.func,
  onShare: PropTypes.func,
  onAdd: PropTypes.func.isRequired,
};

export default memo(Column);

