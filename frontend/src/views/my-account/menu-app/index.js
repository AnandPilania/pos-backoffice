import React, {Component, Fragment} from 'react';
import {Row, Card, CardBody, CardTitle} from "reactstrap";
import Select from "react-select";
import ImageUploader from "react-images-upload";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import {Colxx, Separator} from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import IntlMessages from "../../../helpers/IntlMessages";
import ColorPicker from "../../../components/common/ColorPicker";
import {connect} from "react-redux";
import {updateMenuAppColor, updateMenuAppLogo} from "../../../redux/actions";
import {mediaPath} from "../../../constants/defaultValues";
import {NotificationManager} from "../../../components/common/react-notifications";

class MenuAppSettings extends Component {

    constructor(props) {
        super(props);

        const {
            templateNo,
            bannerColor,
            categoryBgColor,
            productBgColor,
            fontColor
        } = this.props.menuAppSettings;

        this.state = {
            templateNo: {
                label: "Template " + templateNo,
                value: templateNo
            },
            bannerColor,
            categoryBgColor,
            productBgColor,
            fontColor,
            image: [],
            imageUploaderKey: 0
        };
    }

    handleColorChanged = (id, color) => {
        this.setState({
            [id]: color
        });
    }

    handleTemplateChange = templateNo => {
        this.setState({templateNo});
    }

    onDropImage = image => {
        this.setState({
            image
        });
    }

    saveTemplate = () => {
        this.props.updateMenuAppColor({
            'template-no': this.state.templateNo.value,
            'category-background-color': this.state.categoryBgColor,
            'product-background-color': this.state.productBgColor,
            'banner-color': this.state.bannerColor,
            'font-color': this.state.fontColor
        });
    }

    uploadLogo = () => {
        if (this.state.image.length === 0) {
            NotificationManager.warning(
                "Please choose a image first",
                "Info",
                3000,
                null,
                null,
                ''
            );
            return;
        }
        const data = new FormData();
        data.append('file', this.state.image[0]);
        this.props.updateMenuAppLogo(data);
        this.setState({
            image: []
        });
    }

    render() {

        const {
            bannerColor,
            categoryBgColor,
            productBgColor,
            fontColor,
            companyLogo
        } = this.props.menuAppSettings;
        const {templateNo} = this.state;

        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="menu.menu-design" match={this.props.match}/>
                        <Separator className="mb-5"/>
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12" className="mb-4">
                        <Row>
                            <Colxx sm="12" md="6">
                                <Card className="mb-4">
                                    <CardBody>
                                        <CardTitle>
                                            <span><IntlMessages id="page.menu-app-settings.company-logo"/></span>
                                        </CardTitle>
                                        <div className="mb-4">
                                            <Row>
                                                <Colxx xxs="12">
                                                    <img src={`${mediaPath}/company_logos/${companyLogo}`}
                                                         className="card-img-top"
                                                         alt="Company Logo"/>

                                                </Colxx>
                                                <Colxx xxs="12">
                                                    <ImageUploader
                                                        key={companyLogo}
                                                        withPreview={true}
                                                        onChange={this.onDropImage}
                                                        singleImage={true}
                                                        buttonText="Choose Image"
                                                    />
                                                </Colxx>
                                            </Row>
                                        </div>
                                        <button onClick={this.uploadLogo}
                                                className={`btn btn-primary btn-multiple-state float-right ${this.props.logoLoading ? "show-spinner" : ""}`}
                                        >
                                            <span className="spinner d-inline-block">
                                                <span className="bounce1"/>
                                                <span className="bounce2"/>
                                                <span className="bounce3"/>
                                            </span>
                                            <span className="label"><IntlMessages id="pages.upload-logo"/></span>
                                        </button>
                                    </CardBody>
                                </Card>
                            </Colxx>

                            <Colxx sm="12" md="6">
                                <Card className="mb-4">
                                    <CardBody>
                                        <CardTitle>
                                            <span><IntlMessages id="page.menu-app-settings.template"/></span>
                                        </CardTitle>

                                        <div className="mb-4">
                                            <h6 className="font-weight-light">
                                                <IntlMessages id="page.menu-app-settings.template"/>
                                            </h6>
                                            <Select
                                                components={{Input: CustomSelectInput}}
                                                className="react-select"
                                                classNamePrefix="react-select"
                                                value={templateNo}
                                                onChange={this.handleTemplateChange}
                                                options={[
                                                    {label: "Template 1", value: 1},
                                                    {label: "Template 2", value: 2}
                                                ]}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <h6 className="font-weight-light">
                                                <IntlMessages id="page.menu-app-settings.banner-background-color"/>
                                            </h6>
                                            <ColorPicker initialColor={bannerColor}
                                                         colorChanged={this.handleColorChanged}
                                                         id="bannerColor"/>
                                        </div>

                                        <div className="mb-4">
                                            <h6 className="font-weight-light">
                                                <IntlMessages
                                                    id="page.menu-app-settings.category-list-background-color"/>
                                            </h6>
                                            <ColorPicker initialColor={categoryBgColor}
                                                         colorChanged={this.handleColorChanged}
                                                         id="categoryBgColor"/>
                                        </div>

                                        <div className="mb-4">
                                            <h6 className="font-weight-light">
                                                <IntlMessages
                                                    id="page.menu-app-settings.product-list-background-color"/>
                                            </h6>
                                            <ColorPicker initialColor={productBgColor}
                                                         colorChanged={this.handleColorChanged}
                                                         id="productBgColor"/>
                                        </div>

                                        <div className="mb-4">
                                            <h6 className="font-weight-light">
                                                <IntlMessages id="page.menu-app-settings.font-color"/>
                                            </h6>
                                            <ColorPicker initialColor={fontColor}
                                                         colorChanged={this.handleColorChanged}
                                                         id="fontColor"/>
                                        </div>

                                        <button onClick={this.saveTemplate}
                                                className={`btn btn-primary btn-multiple-state float-right ${this.props.templateLoading ? "show-spinner" : ""}`}
                                        >
                                            <span className="spinner d-inline-block">
                                                <span className="bounce1"/>
                                                <span className="bounce2"/>
                                                <span className="bounce3"/>
                                            </span>
                                            <span className="label"><IntlMessages id="pages.save"/></span>
                                        </button>
                                    </CardBody>
                                </Card>
                            </Colxx>
                        </Row>
                    </Colxx>
                </Row>
            </Fragment>
        )
    }
}

const mapStateToProps = ({mySite}) => {
    const {menuAppSettings, templateLoading, logoLoading} = mySite;
    return {menuAppSettings, templateLoading, logoLoading};
};

export default connect(
    mapStateToProps,
    {
        updateMenuAppColor,
        updateMenuAppLogo
    }
)(MenuAppSettings);
