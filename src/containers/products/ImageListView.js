import React, {Component} from "react";
import {
  Row,
  Card,
  CardBody,
  CardSubtitle,
  CardImg,
  CardText,
  CustomInput,
  Badge
} from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { ContextMenuTrigger } from "react-contextmenu";
import { Colxx } from "../../components/common/CustomBootstrap";
import {productImagePath} from "../../constants/defaultValues";
import {injectIntl} from "react-intl";
import {connect} from "react-redux";
import {toggleProductState} from "../../redux/products/actions";

class ImageListView extends Component {

  render() {
    const { product, isSelect, collect, onCheckItem, toggleItems, intl } = this.props;
    return (
        <Colxx sm="6" lg="4" xl="3" className="mb-3" key={product.id}>
          <ContextMenuTrigger id="menu_id" data={product.id} collect={collect}>
            <Card
                onClick={event => onCheckItem(event, product.id)}
                className={classnames({
                  active: isSelect
                })}
            >
              <div className="position-relative">
                <NavLink to={`products/edit/${product.id}`} className="w-40 w-sm-100">
                  <CardImg top alt={product.name} src={productImagePath + "/thumbnail/" + product.picture} />
                </NavLink>
                <Badge color={
                  toggleItems.indexOf(product.id) !== -1 ? 'info' : (product.show_flag === 1 ? 'primary' : 'danger')}
                       pill
                       className="position-absolute badge-top-left"
                >
                  {toggleItems.indexOf(product.id) !== -1 ?
                      <div className="show-spinner badge-multiple-state badge">
                                                <span className="spinner d-inline-block">
                                                  <span className="bounce1"/>
                                                  <span className="bounce2"/>
                                                  <span className="bounce3"/>
                                                </span>
                      </div> : (product.show_flag === 1 ?
                          intl.messages['pages.active-c'] :
                          intl.messages['pages.inactive-c'])}
                </Badge>
              </div>
              <CardBody>
                <Row>
                  <Colxx xxs="2">
                    <CustomInput
                        className="item-check mb-0"
                        type="checkbox"
                        id={`check_${product.id}`}
                        checked={isSelect}
                        onChange={() => {}}
                        label=""/>
                  </Colxx>
                  <Colxx xxs="10" className="mb-3">
                    <CardSubtitle>{product.name}</CardSubtitle>
                    <CardText className="text-muted text-small mb-0 font-weight-light">
                      {product.category.name}
                    </CardText>
                  </Colxx>
                </Row>
              </CardBody>
            </Card>
          </ContextMenuTrigger>
        </Colxx>
    );
  }

}

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
const mapStateToProps = ({products}) => {
  const {toggleItems} = products;
  return {toggleItems};
};
export default injectIntl(
    connect(
        mapStateToProps,
        {
          toggleProductState
        }
    )(ImageListView)
);
