import React from "react";
import { UncontrolledDropdown, DropdownToggle } from "reactstrap";


const TopnavNotifications = () => {
  return (
    <div className="position-relative d-inline-block">
      <UncontrolledDropdown className="dropdown-menu-right">
        <DropdownToggle
          className="header-icon notificationButton"
          color="empty"
        >
          <i className="simple-icon-bell" />
        </DropdownToggle>
      </UncontrolledDropdown>
    </div>
  );
};

export default TopnavNotifications;
