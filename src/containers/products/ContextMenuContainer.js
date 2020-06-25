import React from "react";
import { ContextMenu, MenuItem } from "react-contextmenu";

const ContextMenuContainer = ({onContextMenu,onContextMenuClick, selectedItemsLength}) => {
  return (
    <ContextMenu
      id="menu_id"
      onShow={e => onContextMenu(e, e.detail.data)}
    >
      {
        selectedItemsLength === 1 &&
            <MenuItem onClick={onContextMenuClick} data={{ action: "edit" }}>
              <i className="simple-icon-note" /> <span>Edit</span>
            </MenuItem>
      }
      <MenuItem onClick={onContextMenuClick} data={{ action: "delete" }}>
        <i className="simple-icon-trash" /> <span>Delete</span>
      </MenuItem>
    </ContextMenu>
  );
};

export default ContextMenuContainer;
