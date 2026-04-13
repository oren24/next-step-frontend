import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';
import DraggableItem from '../../../components/cards/DraggableItem.jsx';
import { getAdjacentStatuses } from '../utils/applicationHelpers.js';

function DraggableItemWrapper({
  app,
  status,
  statusOrder,
  updateAppStatus,
  onOpen,
  onRequestEdit,
  onRequestDelete,
  onShare,
}) {
  const { leftStatus, rightStatus, isFirst, isLast } = getAdjacentStatuses(status, statusOrder);

  const handleUpdateAppStatus = useCallback(
    (id, toStatus) => {
      if (!toStatus) return null;
      return updateAppStatus(id, toStatus);
    },
    [updateAppStatus]
  );

  return (
    <DraggableItem
      app={app}
      leftStatus={leftStatus}
      rightStatus={rightStatus}
      updateAppStatus={handleUpdateAppStatus}
      onOpen={onOpen}
      onRequestEdit={onRequestEdit}
      onRequestDelete={onRequestDelete}
      onShare={onShare}
      isFirst={isFirst}
      isLast={isLast}
    />
  );
}

DraggableItemWrapper.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  status: PropTypes.string.isRequired,
  statusOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateAppStatus: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  onRequestEdit: PropTypes.func,
  onRequestDelete: PropTypes.func,
  onShare: PropTypes.func,
};

export default memo(DraggableItemWrapper);
