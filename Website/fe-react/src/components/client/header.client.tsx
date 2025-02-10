import { useState, useEffect } from "react";
import {
    ArrowRightOutlined,
    ClusterOutlined,
    CodeOutlined,
    CoffeeOutlined,
    ContactsOutlined,
    DashOutlined,
    HomeOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    RiseOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
    TagsOutlined,
    TwitterOutlined,
    UserSwitchOutlined,
} from "@ant-design/icons";
import { Avatar, Drawer, Dropdown, MenuProps, Space, message } from "antd";
import { Menu, ConfigProvider } from "antd";
import styles from "@/styles/client.module.scss";
import { isMobile } from "react-device-detect";
import { FaReact } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { callLogout } from "@/config/api";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import ManageAccount from "./modal/manage.account";

const Header = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(
        (state) => state.account.isAuthenticated
    );
    const user = useAppSelector((state) => state.account.user);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    const [current, setCurrent] = useState("home");
    const location = useLocation();

    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location]);

    const items: MenuProps["items"] = [
        {
            label: <Link to={"/"}>Trang Chủ</Link>,
            key: "/",
            icon: <HomeOutlined />,
        },
        {
            label: <Link to={"/product"}>Sản phẩm</Link>,
            key: "/product",
            icon: <TagsOutlined />,
        },
        {
            label: <Link to={"/type"}>Loại sản phẩm</Link>,
            key: "/type",
            icon: <ClusterOutlined />,
        },
    ];

    const onClick: MenuProps["onClick"] = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(setLogoutAction({}));
            message.success("Đăng xuất thành công");
            navigate("/");
        }
    };

    const itemsDropdown = [
        {
            label: (
                <label
                    style={{ cursor: "pointer" }}
                    onClick={() => setOpenManageAccount(true)}
                >
                    Quản lý tài khoản
                </label>
            ),
            key: "manage-account",
            icon: <SettingOutlined />,
        },
        {
            label: <Link to={"/admin"}>Trang Quản Trị</Link>,
            key: "admin",
            icon: <UserSwitchOutlined />,
        },
        {
            label: (
                <label
                    style={{ cursor: "pointer" }}
                    onClick={() => handleLogout()}
                >
                    Đăng xuất
                </label>
            ),
            key: "logout",
            icon: <ArrowRightOutlined />,
        },
    ];

    const itemsMobiles = [...items, ...itemsDropdown];

    return (
        <>
            <div className={styles["header-section"]}>
                <div className={styles["container"]}>
                    {!isMobile ? (
                        <div style={{ display: "flex", gap: 30 }}>
                            <div className={styles["brand"]}>
                                <CoffeeOutlined
                                    style={{
                                        fontSize: "30px",
                                        color: "#388e3c",
                                    }}
                                    onClick={() => navigate("/")}
                                    title="Tiệm trà & Cà phê"
                                />
                            </div>
                            <div className={styles["top-menu"]}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: "#fff",
                                            colorBgContainer: "#222831",
                                            colorText: "#a7a7a7",
                                        },
                                    }}
                                >
                                    <Menu
                                        // onClick={onClick}
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                    />
                                </ConfigProvider>
                                <div className={styles["extra"]}>
                                    {isAuthenticated === false ? (
                                        <Link to={"/login"}>Đăng Nhập</Link>
                                    ) : (
                                        <Dropdown
                                            menu={{ items: itemsDropdown }}
                                            trigger={["click"]}
                                        >
                                            <Space
                                                style={{ cursor: "pointer" }}
                                            >
                                                <span>
                                                    Kính chào! {user?.name}
                                                </span>
                                                <Avatar
                                                    style={{
                                                        backgroundColor:
                                                            "red", // Màu nền là xanh lá cây
                                                        color: "black", // Màu chữ là đen
                                                    }}
                                                >
                                                    {user?.name
                                                        ?.substring(0, 2)
                                                        ?.toUpperCase()}
                                                </Avatar>
                                            </Space>
                                        </Dropdown>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles["header-mobile"]}>
                            <span>Your APP</span>
                            <MenuFoldOutlined
                                onClick={() => setOpenMobileMenu(true)}
                            />
                        </div>
                    )}
                </div>
            </div>
            <Drawer
                title="Chức năng"
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={itemsMobiles}
                />
            </Drawer>
            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            />
        </>
    );
};

export default Header;
