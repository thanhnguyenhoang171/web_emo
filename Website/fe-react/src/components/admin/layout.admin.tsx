import React, { useState, useEffect } from "react";
import {
    AppstoreOutlined,
    ExceptionOutlined,
    ApiOutlined,
    UserOutlined,
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AliwangwangOutlined,
    LogoutOutlined,
    HeartTwoTone,
    BugOutlined,
    ScheduleOutlined,
    CoffeeOutlined,
    DatabaseOutlined,
    ShoppingOutlined,
    LockOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, message, Avatar, Button } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { callLogout } from "config/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { isMobile } from "react-device-detect";
import type { MenuProps } from "antd";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import { ALL_PERMISSIONS } from "@/config/permissions";

const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState("");
    const user = useAppSelector((state) => state.account.user);

    const permissions = useAppSelector(
        (state) => state.account.user.permissions
    );
    const [menuItems, setMenuItems] = useState<MenuProps["items"]>([]);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (permissions?.length) {
            const viewType = permissions.find(
                (item) =>
                    item.path === ALL_PERMISSIONS.TYPES.GET_PAGINATE.path &&
                    item.method ===
                        ALL_PERMISSIONS.TYPES.GET_PAGINATE.method
            );

            const viewUser = permissions.find(
                (item) =>
                    item.path === ALL_PERMISSIONS.USERS.GET_PAGINATE.path &&
                    item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            );

            const viewProduct = permissions.find(
                (item) =>
                    item.path === ALL_PERMISSIONS.PRODUCTS.GET_PAGINATE.path &&
                    item.method === ALL_PERMISSIONS.PRODUCTS.GET_PAGINATE.method
            );

            const viewRating = permissions.find(
                (item) =>
                    item.path === ALL_PERMISSIONS.RATINGS.GET_PAGINATE.path &&
                    item.method === ALL_PERMISSIONS.RATINGS.GET_PAGINATE.method
            );

            const viewRole = permissions.find(
                (item) =>
                    item.path === ALL_PERMISSIONS.ROLES.GET_PAGINATE.path &&
                    item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
            );

            const viewPermission = permissions.find(
                (item) =>
                    item.path ===
                        ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.path &&
                    item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            );

            const full = [
                {
                    label: <Link to="/admin">Dashboard</Link>,
                    key: "/admin",
                    icon: <AppstoreOutlined />,
                },
                ...(viewType
                    ? [
                          {
                              label: (
                                  <Link to="/admin/type">Loại sản phẩm</Link>
                              ),
                              key: "/admin/type",
                              icon: <CoffeeOutlined />,
                          },
                      ]
                    : []),
                ...(viewProduct
                    ? [
                          {
                              label: <Link to="/admin/product">Sản Phẩm</Link>,
                              key: "/admin/product",
                              icon: <ShoppingOutlined />,
                          },
                      ]
                    : []),
                ...(viewUser
                    ? [
                          {
                              label: <Link to="/admin/user">Người dùng</Link>,
                              key: "/admin/user",
                              icon: <UserOutlined />,
                          },
                      ]
                    : []),

                ...(viewRating
                    ? [
                          {
                              label: <Link to="/admin/rating">Đánh giá</Link>,
                              key: "/admin/rating",
                              icon: <AliwangwangOutlined />,
                          },
                      ]
                    : []),
                ...(viewPermission
                    ? [
                          {
                              label: (
                                  <Link to="/admin/permission">
                                      Quyền truy cập
                                  </Link>
                              ),
                              key: "/admin/permission",
                              icon: <ApiOutlined />,
                          },
                      ]
                    : []),
                ...(viewRole
                    ? [
                          {
                              label: <Link to="/admin/role">Vai trò</Link>,
                              key: "/admin/role",
                              icon: <LockOutlined />,
                          },
                      ]
                    : []),
            ];

            setMenuItems(full);
        }
    }, [permissions]);
    useEffect(() => {
        setActiveMenu(location.pathname);
    }, [location]);

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(setLogoutAction({}));
            message.success("Đăng xuất thành công");
            navigate("/");
        }
    };

    // if (isMobile) {
    //     items.push({
    //         label: <label
    //             style={{ cursor: 'pointer' }}
    //             onClick={() => handleLogout()}
    //         >Đăng xuất</label>,
    //         key: 'logout',
    //         icon: <LogoutOutlined />
    //     })
    // }

    const itemsDropdown = [
        {
            label: <Link to={"/"}>Trang chủ</Link>,
            key: "home",
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
        },
    ];

    return (
        <>
            <Layout style={{ minHeight: "100vh" }} className="layout-admin">
                {!isMobile ? (
                    <Sider
                        theme="light"
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}
                    >
                        <div
                            style={{
                                height: 32,
                                margin: 16,
                                textAlign: "center",
                            }}
                        >
                            <DatabaseOutlined /> Quản Trị Hệ Thống
                        </div>
                        <Menu
                            selectedKeys={[activeMenu]}
                            mode="inline"
                            items={menuItems}
                            onClick={(e) => setActiveMenu(e.key)}
                        />
                    </Sider>
                ) : (
                    <Menu
                        selectedKeys={[activeMenu]}
                        items={menuItems}
                        onClick={(e) => setActiveMenu(e.key)}
                        mode="horizontal"
                    />
                )}

                <Layout>
                    {!isMobile && (
                        <div
                            className="admin-header"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginRight: 20,
                            }}
                        >
                            <Button
                                type="text"
                                icon={
                                    collapsed
                                        ? React.createElement(
                                              MenuUnfoldOutlined
                                          )
                                        : React.createElement(MenuFoldOutlined)
                                }
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: "16px",
                                    width: 64,
                                    height: 64,
                                }}
                            />

                            <Dropdown
                                menu={{ items: itemsDropdown }}
                                trigger={["click"]}
                            >
                                <Space style={{ cursor: "pointer" }}>
                                    Kính chào! {user?.name}
                                    <Avatar
                                        style={{
                                            backgroundColor: "red", // Màu nền là xanh lá cây
                                            color: "black", // Màu chữ là đen
                                        }}
                                    >
                                        {user?.name
                                            ?.substring(0, 2)
                                            ?.toUpperCase()}
                                    </Avatar>
                                </Space>
                            </Dropdown>
                        </div>
                    )}
                    <Content style={{ padding: "15px" }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default LayoutAdmin;
