import React, { useState, useEffect } from "react";
import moment from "moment";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import _ from "lodash";

// component
import AnimationLoading from "../../../components/Animationloading";
import CustomButton from "../../../components/CustomButton";
import { USER_KEY } from "../../../const";
import {
  errorSwal,
  successDeleteSwal,
  successSwal,
  successUpdateSwal,
} from "../../../helper/sweetalert";
import PaginationHelper from "../../../components/PaginationHelper";
import ConfirmDelete from "../../../components/ConfirmDelete";
import EmptyComponent from "../../../components/EmptyComponent";

// apollo
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CREATE_BRAND,
  DELETE_BRAND,
  UPDATE_BRAND,
} from "../../../apollo/brand/Mutation";
import { GET_BRANDS } from "../../../apollo/brand/Query";

// icon
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineBorderColor } from "react-icons/md";
import { GET_CATEGORYS } from "../../../apollo/category/query";

// react bootrap
import { Form, Modal, Spinner, Table, InputGroup } from "react-bootstrap";

function Brand() {
  // ==========> useState <==========
  const history = useHistory();
  const shopId = JSON.parse(localStorage.getItem(USER_KEY))?.data?.shop?.id;
  const [brand, setBrand] = useState();
  const [category, setCateGory] = useState();
  const [selectCategory, setSelectCategory] = useState();
  const [brandTotal, setBrandTotal] = useState();
  const [showDelete, setShowDelete] = useState(false);
  const [Delete, setDelete] = useState("");
  const [searchBrand, setSearchBrand] = useState();
  const [searchCategory, setSearchCategory] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const { _limit, _skip, Pagination_helper } = PaginationHelper();
  const [showBrand, setShowBrand] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState();
  const [editData, setEditData] = useState({});
  const [selectEditCategory, setSelectEditCategory] = useState();

  // ==========> useLazyQuery And useMutation <==========
  const [LoadBrand, { data: GetBrand, loading }] = useLazyQuery(GET_BRANDS, {
    fetchPolicy: "cache-and-network",
  });
  const [LoadCategory, { data: GetCategory, loading: categoryLoadding }] =
    useLazyQuery(GET_CATEGORYS, { fetchPolicy: "cache-and-network" });
  const [createbrand, { loading: loadingCreate }] = useMutation(CREATE_BRAND);
  const [deletebrand, { loading: loadingDelete }] = useMutation(DELETE_BRAND);
  const [updatebrand, { loading: loadingUpdate }] = useMutation(UPDATE_BRAND);

  // ==========> useEffect <==========

  useEffect(() => {
    _filter();
    _fetchCategory();
  }, []);

  useEffect(() => {
    if (GetBrand) {
      setBrand(GetBrand?.brands?.data);
      setBrandTotal(GetBrand?.brands?.total);
    }
  }, [GetBrand]);

  useEffect(() => {
    if (GetCategory) {
      setCateGory(GetCategory?.categories?.data);
    }
  }, [GetCategory]);

  useEffect(() => {
    _filter();
  }, [searchBrand, searchCategory, _skip, pageNumber]);

  const _fetchCategory = async () => {
    await LoadCategory({
      variables: {
        where: {
          shop: shopId,
          isDeleted: false,
        },
      },
    });
  };

  const _filter = async () => {
    try {
      let shopId = JSON.parse(localStorage.getItem("SHOP_DATA"))?.id;

      let _where = {
        shop: shopId,
        isDeleted: false,
      };

      // TODO: check if search text is not empty
      // if (!_.isEmpty(searchCategory)) { _where = { ..._where, title: searchCategory, } }
      if (searchBrand !== "") {
        _where = {
          ..._where,
          name: searchBrand,
        };
      }
      if (!_.isEmpty(searchCategory) && searchCategory !== "ALL") {
        // console.log("step 2")
        _where = { ..._where, category: searchCategory };
      }

      // TODO: Get all product

      await LoadBrand({
        variables: {
          skip: (_skip - 1) * _limit,
          limit: _limit,
          orderBy: "createdAt_DESC",
          where: _where,
        },
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // ==========> fuction delete  <==========
  const handleShowDelete = (id, name) => {
    setDelete({ name, id });
    setShowDelete(true);
  };

  const _confirmeDelete = async () => {
    try {
      if (loadingDelete) return;
      await deletebrand({
        variables: {
          where: {
            id: Delete?.id,
          },
        },
      });
      _filter();
      successDeleteSwal("ລຶບສຳເລັດ");
      setShowDelete(false);
    } catch (err) {
      errorSwal("ການລຶບຂໍ້ມູນບໍ່ສຳເລັດ !");
    }
  };

  // <=============== create Brand =================>

  const _createBrand = async (values) => {
    // console.log({ selectCategory })
    // console.log({ values })
    if (!values.name) {
      errorSwal("ກະລຸນາເພີ່ມເເບນ...");
      return;
    }
    try {
      if (loadingCreate) return;
      await createbrand({
        variables: {
          orderBy: "createdAt_DESC",
          data: {
            ...values,
          },
        },
      });

      _filter();
      successSwal("ເພີ່ມສຳເລັດ");
      setShowBrand(false);
    } catch (err) {
      errorSwal("ລາຍການສິນຄ້ານີ້ມີຢູ່ແລ້ວ");
      // console.log('error creating todo:', err)
    }
  };

  // ========== update ExchangeRate ==========
  const _updatebrand = async () => {
    try {
      if (loadingUpdate) return;
      await updatebrand({
        variables: {
          orderBy: "createdAt_DESC",
          where: {
            id: editData?.id,
          },
          data: {
            name: editData?.name,
            category: selectEditCategory,
          },
        },
      });

      setIsEdit(false);
      setEditIndex();
      setEditData({});
      successUpdateSwal("ເເກ້ໄຂຂໍ້ມູນສຳເລັດ");
      _filter();
      setSelectEditCategory();
    } catch (err) {
      errorSwal("ລາຍການສິນຄ້ານີ້ມີຢູ່ແລ້ວ");
      // console.log("error creating todo:", err);
    }
  };

  // ================ Edit in box =============
  const onEditData = async (data, index) => {
    setIsEdit(true);
    setEditIndex(index);
    setEditData(data);
  };

  const onCancelEditData = async () => {
    setIsEdit(false);
    setEditIndex();
    setEditData({});
  };

  // select Link category

  const handleChangeCategoy = (event) => {
    setSelectCategory(event.target.value);
  };

  const handleChangeEditCategory = (event) => {
    setSelectEditCategory(event.target.value);
  };

  return (
    <React.Fragment>
      <div
        style={{
          paddingLeft: "15px",
          paddingRight: "15px",
        }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "20px",
            height: "100vh",
            overflow: "auto",
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#3C169B",
            }}>
            <span style={{ fontSize: "24px", color: "#6B7280" }}>
              <ArrowBackIcon
                sx={{ fontSize: "30px", cursor: "pointer" }}
                onClick={() => history.goBack()}
              />
              &emsp; ຕັ້ງຄ່າເເບນ({brandTotal})
            </span>
            <span>
              <CustomButton
                width="165px"
                height="46px"
                title="ເພີ່ມເເບນ"
                icon={<AddBoxOutlinedIcon />}
                borderRadius="8px"
                onClick={() => setShowBrand(true)}
              />
            </span>
          </div>

          {/* table */}
          <div style={{ display: "flex" }}>
            <div style={{ width: "30%" }}>
              <InputGroup>
                <InputGroup.Text
                  style={{
                    backgroundColor: "#FFFFFF",
                  }}>
                  <SearchIcon sx={{ color: "#6B7280" }} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="ຄົ້ນຫາເເບນສິນຄ້າ..."
                  aria-describedby="basic-addon2"
                  onChange={(e) => {
                    setSearchBrand(e.target.value);
                  }}
                  value={searchBrand}
                  style={{
                    borderLeft: "none",
                    // width: '40px',
                    // maxWidth: '420px'
                  }}
                />
              </InputGroup>
            </div>
            <div style={{ width: "20%", marginLeft: "20px" }}>
              <Form.Select
                style={{
                  height: "40px",
                  // width: '266px',
                  color: "#6B7280",
                  cursor: "pointer",
                }}
                onChange={(e) => {
                  setSearchCategory(e.target.value);
                }}
                value={searchCategory}>
                <option value="ALL">ປະເພດທັງໝົດ</option>
                {category?.map((categorys) => (
                  <option key={categorys.id} value={categorys?.id}>
                    {categorys?.name}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>

          {loading && !GetBrand && <AnimationLoading />}
          {brand?.length > 0 ? (
            <Table
              style={{
                marginTop: "20px",
                borderCollapse: "collapse",
                width: "100% ",
              }}>
              <thead
                style={{
                  background:
                    "linear-gradient(180deg, #3C169B 0%, #592375 0.01%, #2C206C 100%)",
                  borderRadius: " 8px 8px 0px 0px",
                  color: "#FFFFFF",
                }}>
                <tr>
                  <th>ລ/ດ</th>
                  <th>ຊື່</th>
                  <th>ປະເພດທີ່ລີ້ງ</th>
                  <th>ວັນທີເດືອນປີ</th>
                  <th>ຈັດການ</th>
                </tr>
              </thead>
              <tbody>
                {brand?.map((brand, index) => {
                  return (
                    <tr
                      key={brand + index}
                      style={{ alignItems: "center", whiteSpace: "nowrap" }}>
                      <td style={{ paddingTop: "1rem" }}>
                        {index + 1 + _limit * (_skip - 1)}
                      </td>
                      <td style={{ paddingTop: "1rem" }}>
                        {isEdit == true && editIndex === index ? (
                          <Form.Control
                            type="text"
                            name="name"
                            onChange={(e) => {
                              let _data = editData;
                              _data = {
                                ...editData,
                                name: e?.target?.value,
                              };
                              setEditData(_data);
                            }}
                            value={editData?.name}
                            placeholder="ຊື່ສິນຄ້າ..."
                            style={{
                              border: editData?.name ? "" : "solid 1px red",
                            }}
                          />
                        ) : (
                          <div>{brand?.name}</div>
                        )}
                      </td>
                      {/*  */}
                      <td style={{ paddingTop: "1rem" }}>
                        {isEdit == true && editIndex === index ? (
                          <Form.Select
                            value={selectEditCategory}
                            onChange={handleChangeEditCategory}
                            defaultValue={brand?.category?.id}>
                            {category?.map((e, index) => (
                              <option key={index} value={e?.id}>
                                {e?.name}
                              </option>
                            ))}
                          </Form.Select>
                        ) : (
                          <div>{brand?.category?.name}</div>
                        )}
                      </td>
                      {/*  */}
                      <td style={{ paddingTop: "1rem" }}>
                        {" "}
                        {moment(brand?.createdAt).format("DD/MM/YYYY")}
                      </td>

                      {isEdit == true && editIndex === index ? (
                        <td style={{ width: "30%" }}>
                          <div style={{ display: "flex" }}>
                            <CustomButton
                              width="149px"
                              height="42px"
                              color="#3058A6"
                              background="#F1F1F1"
                              borderRadius="8px"
                              title="ຍົກເລີກ"
                              onClick={() => onCancelEditData()}
                            />
                            &ensp;
                            <CustomButton
                              width="149px"
                              height="42px"
                              borderRadius="8px"
                              title={loadingUpdate ? <Spinner /> : "ບັນທືກ"}
                              onClick={() => _updatebrand()}
                            />
                          </div>
                        </td>
                      ) : (
                        <td style={{ width: "30%" }}>
                          <div
                            style={{ display: "flex", alignItems: "center" }}>
                            <CustomButton
                              width="149px"
                              height="42px"
                              borderRadius="8px"
                              textalign="center"
                              border="1px solid #3C169B"
                              title="ເເກ້ໄຂ"
                              color="#3C169B"
                              background="#F7F7F7"
                              icon={
                                <MdOutlineBorderColor
                                  style={{ color: "#3C169B", fontSize: "20px" }}
                                />
                              }
                              onClick={() => onEditData(brand, index)}
                            />
                            &ensp;
                            <CustomButton
                              width="149px"
                              height="42px"
                              margin="0"
                              title=" ລຶບ"
                              border="1px solid #DC2626"
                              borderRadius="8px"
                              background="#F7F7F7"
                              color="#DC2626"
                              icon={
                                <RiDeleteBin6Line
                                  style={{ color: "#D21C1C", fontSize: "20px" }}
                                />
                              }
                              onClick={() =>
                                handleShowDelete(brand?.id, brand?.name)
                              }
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <div>
              {brand?.length <= 0 && (
                <div
                  style={{
                    fontSize: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#6B7280",
                    fontWeight: "400",
                  }}>
                  <EmptyComponent />
                  <p>ຍັງບໍ່ມີເເບຣນກະລຸນາໄປເພີ່ມເເບຣນກ່ອນ !!!</p>
                </div>
              )}
            </div>
          )}

          {brandTotal > 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}>
              {brandTotal && (
                <div className="show">
                  ກຳລັງສະແດງ {50 * _skip - 49}-
                  {50 * _skip > brandTotal ? brandTotal : 50 * _skip} ຈາກ{" "}
                  {brandTotal}
                </div>
              )}
              <div>{Pagination_helper(brandTotal, "", ``)}</div>
              <div></div>
              <div />
            </div>
          ) : (
            ""
          )}

          {/* end table */}
        </div>
      </div>

      {/* end delete modal */}

      <ConfirmDelete
        title={loadingDelete ? <Spinner /> : "ລຶບ"}
        open={showDelete}
        paragrap={"ທ່ານຕອ້ງການຈະລຶບຂໍ້ມູນ" + ` ${Delete?.name} ` + `ນີ້ເເທ້ບໍ່`}
        onClose={() => setShowDelete(false)}
        onSubmit={_confirmeDelete}
      />

      {/* create Brand */}

      <Modal show={showBrand} onHide={() => setShowBrand(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ເພີ່ມເເບນ</Modal.Title>
        </Modal.Header>
        <Formik
          enableReinitialize={true}
          initialValues={{
            name: "",
            shop: shopId,
            category: selectCategory,
          }}
          validate={(values) => {
            // const errors = {};
            // if (!values.name) {
            //     errors.name = 'ກະລຸນາປ້ອນ ຊື່ເເບນ... !';
            // }
            // return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            await _createBrand(values);
          }}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <>
              <Modal.Body>
                <Form.Label>ເລືອກເຊື່ອມກັບປະເພດ</Form.Label>

                <Form.Select
                  value={values.category}
                  onChange={handleChangeCategoy}>
                  <option>ເລຶອກປະເພດສິນຄ້າ</option>
                  {category?.map((e, index) => (
                    <option key={index} value={e?.id}>
                      {e?.name}
                    </option>
                  ))}
                </Form.Select>

                <Form.Label>ຊື່ເເບນ</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder="ຊື່ເເບນ..."
                />
              </Modal.Body>
              <Modal.Footer>
                <CustomButton
                  title="ຍົກເລີກ"
                  width="100px"
                  background="#A9B3BD"
                  borderRadius="8px"
                  onClick={() => setShowBrand(false)}
                />
                &ensp;
                <CustomButton
                  title={loadingCreate ? <Spinner /> : "ບັນທຶກ"}
                  width="100px"
                  borderRadius="8px"
                  onClick={() => handleSubmit()}
                />
              </Modal.Footer>
            </>
          )}
        </Formik>
      </Modal>

      {/* end create Brand */}
    </React.Fragment>
  );
}

export default Brand;
