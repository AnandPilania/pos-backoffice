import React, {Component} from "react";
import {injectIntl} from "react-intl";
import {
    UncontrolledDropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
} from "reactstrap";

import {NavLink, Link} from "react-router-dom";
import {connect} from "react-redux";

import {
    setContainerClassnames,
    clickOnMobileMenu,
    logoutUser,
    changeLocale
} from "../../redux/actions";

import {
    localeOptions,
    isDarkSwitchActive,
    mediaPath
} from "../../constants/defaultValues";

import {MobileMenuIcon, MenuIcon} from "../../components/svg";
import TopnavNotifications from "./Topnav.Notifications";
import TopnavDarkSwitch from "./Topnav.DarkSwitch";

import {getDirection, setDirection} from "../../helpers/Utils";

class TopNav extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isInFullScreen: false,
            searchKeyword: ""
        };
    }

    handleChangeLocale = (locale, direction) => {
        this.props.changeLocale(locale);

        const currentDirection = getDirection().direction;
        if (direction !== currentDirection) {
            setDirection(direction);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    };

    handleLogout = () => {
        this.props.logoutUser(this.props.history);
    };

    menuButtonClick = (e, menuClickCount, containerClassnames) => {
        e.preventDefault();

        setTimeout(() => {
            var event = document.createEvent("HTMLEvents");
            event.initEvent("resize", false, false);
            window.dispatchEvent(event);
        }, 350);
        this.props.setContainerClassnames(
            ++menuClickCount,
            containerClassnames,
            this.props.selectedMenuHasSubItems
        );
    };
    mobileMenuButtonClick = (e, containerClassnames) => {
        e.preventDefault();
        this.props.clickOnMobileMenu(containerClassnames);
    };

    render() {
        const {containerClassnames, menuClickCount, locale} = this.props;
        return (
            <nav className="navbar fixed-top">
                <div className="d-flex align-items-center navbar-left">
                    <NavLink
                        to="#" location={{}}
                        className="menu-button d-none d-md-block"
                        onClick={e =>
                            this.menuButtonClick(e, menuClickCount, containerClassnames)
                        }
                    >
                        <MenuIcon/>
                    </NavLink>
                    <NavLink
                        to="#" location={{}}
                        className="menu-button-mobile d-xs-block d-sm-block d-md-none"
                        onClick={e => this.mobileMenuButtonClick(e, containerClassnames)}
                    >
                        <MobileMenuIcon/>
                    </NavLink>

                    <div className="d-inline-block">
                        <UncontrolledDropdown className="ml-2">
                            <DropdownToggle
                                caret
                                color="light"
                                size="sm"
                                className="language-button"
                            >
                                <span className="name">{locale.toUpperCase()}</span>
                            </DropdownToggle>
                            <DropdownMenu className="mt-3" right>
                                {localeOptions.map(l => {
                                    return (
                                        <DropdownItem
                                            onClick={() => this.handleChangeLocale(l.id, l.direction)}
                                            key={l.id}
                                        >
                                            {l.name}
                                        </DropdownItem>
                                    );
                                })}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>

                </div>

                <div className="navbar-right">
                    {isDarkSwitchActive && <TopnavDarkSwitch/>}

                    <div className="header-icons d-inline-block align-middle">

                        <TopnavNotifications/>
                    </div>
                    <div className="user d-inline-block">
                        <UncontrolledDropdown className="dropdown-menu-right">
                            <DropdownToggle className="p-0" color="empty">
                                <span
                                    className="name mr-1">{this.props.loginUser ? this.props.loginUser.firstName + ' ' + this.props.loginUser.lastName : ''}</span>
                                <span>
                  <img alt="Profile" src={
                      this.props.loginUser.companyLogo !== undefined
                          ? `${mediaPath}/company_logos/${this.props.loginUser.companyLogo}`
                          : '/assets/img/profile-pic-l.jpg'
                  }/>
                </span>
                            </DropdownToggle>
                            <DropdownMenu className="mt-3" right>
                                <Link to="/my-site/information">
                                    <DropdownItem>Profile</DropdownItem>
                                </Link>
                                <DropdownItem divider/>
                                <DropdownItem onClick={this.handleLogout}>
                                    Sign out
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = ({menu, settings, authUser}) => {
    const {containerClassnames, menuClickCount, selectedMenuHasSubItems} = menu;
    const {locale} = settings;
    const {user: loginUser} = authUser;
    return {
        containerClassnames,
        menuClickCount,
        selectedMenuHasSubItems,
        locale,
        loginUser
    };
};
export default injectIntl(
    connect(
        mapStateToProps,
        {setContainerClassnames, clickOnMobileMenu, logoutUser, changeLocale}
    )(TopNav)
);
