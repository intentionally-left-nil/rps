import React, { useCallback, useMemo } from 'react';
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './PlayerName.css';

// The bootstrap table doesn't play nicely with react hooks
// We need to store the data immutably, since the boostrapTable modifies the array
// Thus, create a global store, have one array per-component and then use the onChange hooks to notify upwards
const dataHack: Record<string, { id: number; name: string }[]> = {};

const PlayerName: React.FC<{
  id: string;
  initial: string;
  readOnly?: boolean;
  onNameChange?: (name: string) => void;
}> = ({ id, onNameChange, initial, readOnly }) => {
  if (dataHack[id] == null) {
    dataHack[id] = [{ id: 0, name: initial }];
  }

  const afterSave = useCallback(
    (_oldValue: string, newValue: string) => {
      if (onNameChange) {
        onNameChange(newValue);
      }
      return true;
    },
    [onNameChange]
  );

  const columns = useMemo<ColumnDescription[]>(
    () => [
      {
        dataField: 'name',
        text: 'Player Name',
        style: { maxWidth: '300px' },
        editable: !readOnly,
      },
    ],
    [readOnly]
  );

  const cellEdit = useMemo(
    () =>
      cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: afterSave,
      }),
    [afterSave]
  );

  return (
    <BootstrapTable
      bordered={!readOnly}
      keyField="id"
      data={dataHack[id]}
      headerWrapperClasses="visually-hidden"
      columns={columns}
      cellEdit={cellEdit}
      wrapperClasses="PlayerName"
    />
  );
};
export default PlayerName;
