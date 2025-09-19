import React, { useEffect, useState } from 'react';
import { getUserApi } from '../util/api';
import { notification, Table, Input, Space, Button, Select } from 'antd';

const { Option } = Select;

const UserPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUser = async (page, size, filters) => {
    try {
      setLoading(true);
      const query = filters || {
        name: nameFilter,
        email: emailFilter,
        role: roleFilter,
      };
      const res = await getUserApi(page, size, query);
      if (res?.result) {
        setDataSource(res.data.content);
        setPagination({
          current: page,
          pageSize: size,
          total: res.data.totalPages,
        });
      } else {
        notification.error({
          message: 'Unauthorized',
          description: res.message,
        });
      }
    } catch (err) {
      notification.error({
        message: 'Error',
        description: 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (pag) => {
    fetchUser(pag.current, pag.pageSize);
  };

  const handleFilter = () => {
    fetchUser(1, pagination.pageSize);
  };

  const handleClear = () => {
    const resetFilters = { name: '', email: '', role: '' };
    setNameFilter('');
    setEmailFilter('');
    setRoleFilter('');
    fetchUser(1, pagination.pageSize, resetFilters);
  };

  const columns = [
    { title: 'Id', dataIndex: '_id' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Role', dataIndex: 'role' },
  ];

  return (
    <div style={{ padding: 30 }}>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder='Filter by name'
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          style={{ width: 200 }}
        />
        <Input
          placeholder='Filter by email'
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder='Select role'
          value={roleFilter || undefined}
          onChange={(value) => setRoleFilter(value)}
          allowClear
          style={{ width: 150 }}
        >
          <Option value='admin'>Admin</Option>
          <Option value='user'>User</Option>
          <Option value='editor'>Editor</Option>
        </Select>
        <Button type='primary' onClick={handleFilter}>
          Filter
        </Button>
        <Button onClick={handleClear}>Clear</Button>
      </Space>

      <Table
        bordered
        rowKey='_id'
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default UserPage;
