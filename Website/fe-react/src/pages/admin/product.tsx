import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IProduct } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { Button, Popconfirm, Select, Space, Tag, message, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callDeleteProduct } from "@/config/api";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";
import { fetchProduct } from "@/redux/slice/productSlide";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

const ProductPage = () => {
    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.product.isFetching);
    const meta = useAppSelector((state) => state.product.meta);
    const products = useAppSelector((state) => state.product.result);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleDeleteProduct = async (_id: string | undefined) => {
        if (_id) {
            const res = await callDeleteProduct(_id);
            if (res && res.data) {
                message.success('Xóa sản phẩm thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IProduct>[] = [
        {
            title: "STT",
            key: "index",
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
            },
            hideInSearch: true,
        },
        {
            title: "ID",
            dataIndex: "_id",
            width: 250,
            render: (text, record, index, action) => {
                return <span>{record._id}</span>;
            },
            hideInSearch: true,
        },
        {
            title: "Sản phẩm",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Giá",
            dataIndex: "price",
            sorter: true,
            render(dom, entity, index, action, schema) {
                const str = "" + entity.price;
                return <>{str?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ</>;
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <Tag color={entity.isActive ? "lime" : "red"}>
                            {entity.isActive ? "ACTIVE" : "INACTIVE"}
                        </Tag>
                    </>
                );
            },
            hideInSearch: true,
        },

        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>
                );
            },
            hideInSearch: true,
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</>
                );
            },
            hideInSearch: true,
        },
        {
            title: "Chức năng",
            hideInSearch: true,
            width: 100,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.PRODUCTS.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: "#ffa500",
                            }}
                            type=""
                            onClick={() => {
                                navigate(
                                    `/admin/product/upsert?id=${entity._id}`
                                );
                            }}
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.PRODUCTS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa sản phẩm"}
                            description={"Bạn có chắc chắn muốn xóa sản phẩm này ?"}
                            onConfirm={() => handleDeleteProduct(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span
                                style={{ cursor: "pointer", margin: "0 10px" }}
                            >
                                <DeleteOutlined
                                    style={{
                                        fontSize: 20,
                                        color: "#ff4d4f",
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        if (clone.name) clone.name = `/${clone.name}/i`;
        if (clone.price) clone.price = `/${clone.price}/i`;
       
        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name" : "sort=-name";
        }
        if (sort && sort.salary) {
            sortBy = sort.salary === 'ascend' ? "sort=salary" : "sort=-salary";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt" : "sort=-createdAt";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt" : "sort=-updatedAt";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=-updatedAt`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.PRODUCTS.GET_PAGINATE}>
                <DataTable<IProduct>
                    actionRef={tableRef}
                    headerTitle="Danh sách Sản phẩm"
                    rowKey="_id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={products}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchProduct({ query }));
                    }}
                    scroll={{ x: true }}
                    pagination={{
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => {
                            return (
                                <div>
                                    {" "}
                                    {range[0]}-{range[1]} trên {total} rows
                                </div>
                            );
                        },
                    }}
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => navigate("upsert")}
                            >
                                Thêm mới
                            </Button>
                        );
                    }}
                />
            </Access>
        </div>
    );
}

export default ProductPage;