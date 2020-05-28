import React, { Fragment } from "react";
import IntlMessages from "../../helpers/IntlMessages";


const BreadcrumbContainer = ({ heading}) => {
  return (
    <Fragment>
      {heading && <h1><IntlMessages id={heading}/></h1>}
    </Fragment>
  );
};

export default BreadcrumbContainer;
