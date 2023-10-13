import {
  CContainer,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CFormInput,
  CToaster,
  CToast,
  CToastBody,
  CToastClose,
  CFormSelect,
  CAlert,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CTable,
  CTableHead,
  CTableRow,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
} from "@coreui/react";
import spinner from "../images/spinner.svg";
import CIcon from "@coreui/icons-react";
import { cilCheckAlt } from "@coreui/icons";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Layout from "../layout/Layout.js";
import CurrencyFormat from "react-currency-format";
import Loader from "../components/Loader";
import imageUnavailable from '../images/image-unavailable.png'

const Product = () => {
  const [loadingLabel, setLoadingLabel] = useState(false)

  const [addProductModal, setAddProductModal] = useState(false);
  const [addProductCategoryModal, setAddProductCategoryModal] = useState(false);
  const [addProductSourceModal, setAddProductSourceModal] = useState(false);
  const [addProductVariantModal, setAddProductVariantModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [variantName, setVariantName] = useState("");
  const [productCategory, setProductCategory] = useState([]);
  const [productVariant, setProductVariant] = useState([]);
  const [productSource, setProductSource] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [product, setProduct] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);

  const [productCategoryId, setProductCategoryId] = useState("");
  const [productSourceId, setProductSourceId] = useState("");
  const [productVariantId, setProductVariantId] = useState("");
  const [productName, setProductName] = useState("");
  const [productSize, setProductSize] = useState("");
  const [productUnit, setProductUnit] = useState("");
  const [productPoint, setProductPoint] = useState("");
  const [productCapitalAmount, setProductCapitalAmount] = useState("");
  const [productSaleAmount, setProductSaleAmount] = useState("");
  const [document, setDocument] = useState("");
  const [documentPreview, setDocumentPreview] = useState("");

  // edit
  const [editProductModal, setEditProductModal] = useState(false);
  const [loadingEditModal, setLoadingEditModal] = useState(false)
  const [productEditId, setProductEditId] = useState('')
  const [productEditCategoryId, setProductEditCategoryId] = useState("");
  const [productEditSourceId, setProductEditSourceId] = useState("");
  const [productEditVariantId, setProductEditVariantId] = useState("");
  const [productEditName, setProductEditName] = useState("");
  const [productEditSize, setProductEditSize] = useState("");
  const [productEditUnit, setProductEditUnit] = useState("");
  const [productEditPoint, setProductEditPoint] = useState("");
  const [productEditCapitalAmount, setProductEditCapitalAmount] = useState("");
  const [productEditSaleAmount, setProductEditSaleAmount] = useState("");
  const [documentEdit, setDocumentEdit] = useState("");
  const [documentEditPreview, setDocumentEditPreview] = useState("");
  const [getDocument, setGetDocument] = useState('')

  // change document
  const [changeDocument, setChangeDocument] = useState(false)

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      getProductCategory();
      getProductVariant();
      getProductSource();
      getProduct();
    }
  }, [user]);

  const handlePrint = async (value) => {
    setLoadingLabel(true)
    try {
      await axios.post(process.env.REACT_APP_API_URL+'/generateLabel/'+value)
      .then(() => axios.get(process.env.REACT_APP_API_URL+'/getLabel', {responseType: 'blob'}))
      .then((res) => {
        // const pdfBlob = new Blob([res.data], {type: 'application/pdf'})
        window.open(URL.createObjectURL(res.data), '_blank')
        setLoadingLabel(false)
      })
    } catch (error) {
      console.log(error)
      setLoadingLabel(false)
    }

  };

  const inputFiles = (e) => {
    setDocumentPreview(URL.createObjectURL(e.target.files[0]));
    setDocument(e.target.files[0]);
  }

  const inputEditFiles = (e) => {
    setDocumentEditPreview(URL.createObjectURL(e.target.files[0]))
    setDocumentEdit(e.target.files[0])
  }

  const SubmitProduct = () => {
    if (productName !== "") {
      if (productCategoryId !== "") {
        if (productSize !== "") {
          if (productUnit !== "") {
            if (productCapitalAmount !== "") {
              if (productSaleAmount !== "") {
                if (document.length !== 0) {
                  if (loading) {
                    return (
                      <CButton disabled color="primary" className="px-4">
                        {" "}
                        <img src={spinner} width="16" />
                      </CButton>
                    );
                  } else {
                    return (
                      <CButton color="primary" onClick={submitProduct}>
                        Submit
                      </CButton>
                    );
                  }
                } else {
                  return (
                    <CButton color="primary" disabled>
                      Submit
                    </CButton>
                  );
                }
              } else {
                return (
                  <CButton color="primary" disabled>
                    Submit
                  </CButton>
                );
              }
            } else {
              return (
                <CButton color="primary" disabled>
                  Submit
                </CButton>
              );
            }
          } else {
            return (
              <CButton color="primary" disabled>
                Submit
              </CButton>
            );
          }
        } else {
          return (
            <CButton color="primary" disabled>
              Submit
            </CButton>
          );
        }
      } else {
        return (
          <CButton color="primary" disabled>
            Submit
          </CButton>
        );
      }
    } else {
      return (
        <CButton color="primary" disabled>
          Submit
        </CButton>
      );
    }
  };

  const submitProduct = async (e) => {
    setMessage("");
    // if (setErrorMessage() === '') {
    //     setErrorMessage('')
    // }
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("product_name", productName);
    if (productCategoryId !== "") {
      formData.append("product_category_id", productCategoryId);
    }
    if (productSourceId !== "") {
      formData.append("product_source_id", productSourceId);
    }
    if (productVariantId !== "") {
      formData.append("product_variant_id", productVariantId);
    }
    if (productPoint !== "") {
      formData.append("product_point", productPoint);
    }
    formData.append("product_size", productSize);
    formData.append("product_size_unit", productUnit);
    formData.append("product_capital_amount", productCapitalAmount);
    formData.append("product_sale_amount", productSaleAmount);
    formData.append("createdBy", user.name);
    formData.append("document", document);
    try {
      const post = await axios.post(
        process.env.REACT_APP_API_URL + "/addProduct",
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );
      if (post.data.status === true) {
        setMessage(post.data.message);
        setTimeout(() => {
          setMessage("");
        }, 5000);
        setLoading(false);
        setProductName("");
        setProductCategoryId("");
        setProductSourceId("");
        setProductVariantId("");
        setProductSize("");
        setProductUnit("");
        setProductPoint("");
        setProductCapitalAmount("");
        setProductSaleAmount("");
        setDocument((e.target.value = null));
        setDocumentPreview((e.target.value = null));
        getProduct();
        // setAddProductModal(false)
      } else {
        setErrorMessage(post.data.message);
        setLoading(false);
      }
    } catch (error) {
      if (error.post) {
        setErrorMessage(error.post.data.message);
        setTimeout(() => {
          setErrorMessage("");
        }, 2000);
        setLoading(false);
      }
      setErrorMessage(error);
    }
  };

  const SubmitNewCategory = () => {
    if (categoryName !== "") {
      if (loading) {
        return (
          <CButton color="primary" disabled>
            <img src={spinner} width="16" />
          </CButton>
        );
      } else {
        return (
          <CButton color="primary" onClick={submitCategory}>
            Add
          </CButton>
        );
      }
    } else {
      return (
        <CButton color="primary" disabled>
          Add
        </CButton>
      );
    }
  };

  const SubmitNewVariant = () => {
    if (variantName !== "") {
      if (loading) {
        return (
          <CButton color="primary" disabled>
            <img src={spinner} width="16" />
          </CButton>
        );
      } else {
        return (
          <CButton color="primary" onClick={submitVariant}>
            Add
          </CButton>
        );
      }
    } else {
      return (
        <CButton color="primary" disabled>
          Add
        </CButton>
      );
    }
  };

  const SubmitNewSource = () => {
    if (sourceName !== "") {
      if (loading) {
        return (
          <CButton color="primary" disabled>
            <img src={spinner} width="16" />
          </CButton>
        );
      } else {
        return (
          <CButton color="primary" onClick={submitSource}>
            Add
          </CButton>
        );
      }
    } else {
      return (
        <CButton color="primary" disabled>
          Add
        </CButton>
      );
    }
  };

  const submitCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/addProductCategory",
        {
          product_category_name: categoryName.toUpperCase(),
          userName: user.name,
        }
      );
      if (response.data.status === true) {
        setMessage(response.data.message);
        setErrorMessage("");
        setCategoryName("");
        setLoading(false);
        getProductCategory();
      } else {
        setErrorMessage(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const submitVariant = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/addProductVariant",
        {
          product_variant_name: variantName.toUpperCase(),
          userName: user.name,
        }
      );
      if (response.data.status === true) {
        setMessage(response.data.message);
        setErrorMessage("");
        setVariantName("");
        setLoading(false);
        getProductVariant();
      } else {
        setErrorMessage(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const submitSource = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/addProductSource",
        {
          product_source_name: sourceName.toUpperCase(),
          userName: user.name,
        }
      );
      if (response.data.status === true) {
        setMessage(response.data.message);
        setErrorMessage("");
        setSourceName("");
        setLoading(false);
        getProductSource();
      } else {
        setErrorMessage(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getProduct = async () => {
    setLoadingPage(true);
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_URL + "/getProduct"
      );
      setProduct(result.data);
    } catch (error) {
      console.log(error);
    }
    setLoadingPage(false);
  };

  const getProductCategory = async () => {
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_URL + "/getProductCategory"
      );
      setProductCategory(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductVariant = async () => {
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_URL + "/getProductVariant"
      );
      setProductVariant(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductSource = async () => {
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_URL + "/getProductSource"
      );
      setProductSource(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const closeAddProductModal = (value) => {
    switch (value) {
      case "category":
        setCategoryName("");
        setAddProductCategoryModal(false);
        break;
      case "source":
        setSourceName("");
        setAddProductSourceModal(false);
        break;
      case "variant":
        setVariantName("");
        setAddProductVariantModal(false);
        break;
      default:
        {
        }
        break;
    }
  };

  const editProduct = async (value) => {
    setEditProductModal(!editProductModal);
    setLoadingEditModal(true)
    try {
      const result = await axios.get(process.env.REACT_APP_API_URL+'/getProduct/'+value)
      setProductEditId(result.data.id)
      setProductEditName(result.data.product_name)
      setProductEditCategoryId(result.data.product_category_id)
      setProductEditVariantId(result.data.product_variant_id)
      setProductEditSourceId(result.data.product_source_id)
      setProductEditSize(result.data.product_size)
      setProductEditUnit(result.data.product_size_unit)
      setProductEditPoint(result.data.product_point)
      setProductEditCapitalAmount(result.data.product_capital_amount)
      setProductEditSaleAmount(result.data.product_sale_amount)
      setGetDocument(result.data.product_document)
    } catch (error) {
      console.log(error)
    }
    setLoadingEditModal(false)
  };

  const SubmitEditProduct = () => {
    if (productEditName !== "") {
      if (productEditCategoryId !== "") {
        if (productEditSize !== "") {
          if (productEditUnit !== "") {
            if (productEditCapitalAmount !== "") {
              if (productEditSaleAmount !== "") {
                if (loading) {
                  return (
                    <CButton disabled color="primary" className="px-4">
                      {" "}
                      <img src={spinner} width="16" />
                    </CButton>
                  );
                } else {
                  return (
                    <CButton color="primary" onClick={submitEditProduct}>
                      Submit
                    </CButton>
                  );
                }
              } else {
                return (
                  <CButton color="primary" disabled>
                    Submit
                  </CButton>
                );
              }
            } else {
              return (
                <CButton color="primary" disabled>
                  Submit
                </CButton>
              );
            }
          } else {
            return (
              <CButton color="primary" disabled>
                Submit
              </CButton>
            );
          }
        } else {
          return (
            <CButton color="primary" disabled>
              Submit
            </CButton>
          );
        }
      } else {
        return (
          <CButton color="primary" disabled>
            Submit
          </CButton>
        );
      }
    } else {
      return (
        <CButton color="primary" disabled>
          Submit
        </CButton>
      );
    }
  }

  const submitEditProduct = async (e) => {
    setMessage('')
    setErrorMessage('')
    setLoading(true)
    e.preventDefault()
    const formData = new FormData();
    formData.append("product_name", productEditName);
    formData.append("product_category_id", productEditCategoryId);
    formData.append("product_source_id", productEditSourceId);
    formData.append("product_variant_id", productEditVariantId);
    formData.append("product_size", productEditSize);
    formData.append("product_point", productEditPoint);
    formData.append("product_capital_amount", productEditCapitalAmount);
    formData.append("product_sale_amount", productEditSaleAmount);
    formData.append("updatedBy", user.name);
    try {
      const response = await axios.patch(process.env.REACT_APP_API_URL+`/editProduct/${productEditId}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        }
      })
      if (response.data.status === true) {
        setMessage(response.data.message)
        setTimeout(() => {
          setMessage("");
        }, 5000)
        setLoading(false)
        setEditProductModal(false)
        // getProduct()
      } else {
        setLoading(false)
        setErrorMessage(response.data.message)
      }
    } catch (error) {
      setLoading(false)
      setErrorMessage(error)
    }
    getProduct()
  }

  const SubmitChangeDocument = () => {
    if (documentEdit.length !== 0) {
      if (loading) {
        return (
          <CButton disabled color="primary" className="px-4">
            {" "}
            <img src={spinner} width="16" />
          </CButton>
        );
      } else {
        return (
          <CButton color="primary" onClick={submitChangeDocument}>
            Submit
          </CButton>
        );
      }
    } else {
      return (
        <CButton color="primary" disabled>
          Submit
        </CButton>
      );
    }
  }

  const submitChangeDocument = async (e) => {
    setLoading(true)
    setMessage('')
    setErrorMessage('')
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('document', documentEdit)
      formData.append('updatedBy', user.name)
      const response = await axios.patch(process.env.REACT_APP_API_URL+`/changeDocument/${productEditId}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        }
      })
      if (response.data.status === true) {
        setMessage(response.data.message)
        setChangeDocument(false)
        setDocumentEdit(e.target.value = null)
        setDocumentEditPreview(e.target.value = null)
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <Layout>
      {loadingPage ? (
        <Loader height={"60vh"} />
      ) : (
        <CContainer>
          {message ? (
            <CToaster placement="top-end">
              <CToast
                animation={true}
                autohide={true}
                visible={true}
                color="success"
                className="text-white align-items-center"
                delay={5000}
              >
                <div className="d-flex">
                  <CToastBody>
                    <CIcon className="me-1" icon={cilCheckAlt} />
                    {message}
                  </CToastBody>
                  <CToastClose className="me-2 m-auto" white />
                </div>
              </CToast>
            </CToaster>
          ) : (
            ""
          )}
          {
            loadingLabel ?
            <CToaster placement="top-end">
              <CToast
                animation={true}
                autohide={false}
                visible={true}
                color="primary"
                className="text-white align-items-center"
              >
                <div className="d-flex">
                  <CToastBody>
                    Generate label is being processed, please wait...
                  </CToastBody>
                  <img src={spinner} width="40" />
                  <CToastClose className="mx-2 m-auto" white />
                </div>
              </CToast>
            </CToaster> : ''
          }
          <CButton
            className="mb-3 me-2"
            onClick={() => setAddProductModal(!addProductModal)}
          >
            Add Product
          </CButton>
          <CDropdown className="mb-3 me-2">
            <CDropdownToggle color="primary">Add Other</CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                component="button"
                onClick={() =>
                  setAddProductCategoryModal(!addProductCategoryModal)
                }
              >
                New Category
              </CDropdownItem>
              <CDropdownItem
                component="button"
                onClick={() => setAddProductSourceModal(!addProductSourceModal)}
              >
                New Source
              </CDropdownItem>
              <CDropdownItem
                component="button"
                onClick={() =>
                  setAddProductVariantModal(!addProductVariantModal)
                }
              >
                New Variant
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          {/* add Product modal */}
          <CModal
            size="lg"
            backdrop="static"
            alignment="center"
            visible={addProductModal}
            onClose={() => setAddProductModal(false)}
          >
            <CModalHeader onClose={() => setAddProductModal(false)}>
              <CModalTitle>Add Product</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {errorMessage ? (
                <CAlert color="danger">{errorMessage}</CAlert>
              ) : (
                ""
              )}
              <CRow>
                <CCol md={6} className="mb-2">
                  <CFormInput
                    label="Product Name"
                    value={productName}
                    style={{ textTransform: "uppercase" }}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </CCol>
                <CCol md={6} className="mb-2">
                  <CFormSelect
                    label="Product Category"
                    value={productCategoryId}
                    onChange={(e) => setProductCategoryId(e.target.value)}
                  >
                    <option value="">Choose Product Category</option>
                    {productCategory?.map((res) => (
                      <option key={res.id} value={res.id}>
                        {res.product_category_name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol md={6} className="mb-2">
                  <CFormSelect
                    label="Product Variant"
                    value={productVariantId}
                    onChange={(e) => setProductVariantId(e.target.value)}
                  >
                    <option value="">Choose Product Variant</option>
                    {productVariant?.map((res) => (
                      <option key={res.id} value={res.id}>
                        {res.product_variant_name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6} className="mb-2">
                  <CFormSelect
                    label="Product Source"
                    value={productSourceId}
                    onChange={(e) => setProductSourceId(e.target.value)}
                  >
                    <option value="">Choose Product Source</option>
                    {productSource?.map((res) => (
                      <option key={res.id} value={res.id}>
                        {res.product_source_name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol md={4} className="mb-2">
                  <CFormInput
                    label="Product Size"
                    value={productSize}
                    onChange={(e) => setProductSize(e.target.value)}
                  />
                </CCol>
                <CCol md={4} className="mb-2">
                  <CFormSelect
                    label="Product Unit"
                    value={productUnit}
                    onChange={(e) => setProductUnit(e.target.value)}
                  >
                    <option value="">Choose Product Unit</option>
                    <option>Gram</option>
                    <option>Pcs</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4} className="mb-2">
                  <CFormInput
                    label="Product Point"
                    value={productPoint}
                    onChange={(e) => setProductPoint(e.target.value)}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={6} className="mb-2">
                  <CFormInput
                    label="Capital Amount"
                    value={productCapitalAmount}
                    onChange={(e) => setProductCapitalAmount(e.target.value)}
                  />
                </CCol>
                <CCol md={6} className="mb-2">
                  <CFormInput
                    label="Sale Amount"
                    value={productSaleAmount}
                    onChange={(e) => setProductSaleAmount(e.target.value)}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={12} className="mb-2">
                  <CFormInput
                    type="file"
                    id="document"
                    label="Upload Product Image"
                    onChange={inputFiles}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={3} className="mb-2 mt-2 mt-md-4"></CCol>
                <CCol md={6} className="mb-2 mt-2 mt-md-4">
                  <img src={documentPreview} width="100%" />
                </CCol>
                <CCol md={3} className="mb-2 mt-2 mt-md-4"></CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => setAddProductModal(false)}
              >
                Close
              </CButton>
              <SubmitProduct />
            </CModalFooter>
          </CModal>
          {/* end add product modal */}
          {/* add product category modal */}
          <CModal
            backdrop="static"
            alignment="center"
            visible={addProductCategoryModal}
            onClose={() => closeAddProductModal("category")}
          >
            <CModalHeader onClose={() => closeAddProductModal("category")}>
              <CModalTitle>Add Product Category</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {errorMessage ? (
                <CAlert color="danger">{errorMessage}</CAlert>
              ) : (
                ""
              )}
              <CRow>
                <CCol className="mb-2">
                  <CFormInput
                    label="Category Name"
                    value={categoryName}
                    style={{ textTransform: "uppercase" }}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => closeAddProductModal("category")}
              >
                Close
              </CButton>
              <SubmitNewCategory />
            </CModalFooter>
          </CModal>
          {/* end product category modal */}
          {/* add product source modal */}
          <CModal
            backdrop="static"
            alignment="center"
            visible={addProductSourceModal}
            onClose={() => closeAddProductModal("source")}
          >
            <CModalHeader onClose={() => closeAddProductModal("source")}>
              <CModalTitle>Add Product Source</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {errorMessage ? (
                <CAlert color="danger">{errorMessage}</CAlert>
              ) : (
                ""
              )}
              <CRow>
                <CCol className="mb-2">
                  <CFormInput
                    label="Source Name"
                    value={sourceName}
                    style={{ textTransform: "uppercase" }}
                    onChange={(e) => setSourceName(e.target.value)}
                  />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => closeAddProductModal("source")}
              >
                Close
              </CButton>
              <SubmitNewSource />
            </CModalFooter>
          </CModal>
          {/* end product source modal */}
          {/* add product variant modal */}
          <CModal
            backdrop="static"
            alignment="center"
            visible={addProductVariantModal}
            onClose={() => closeAddProductModal("variant")}
          >
            <CModalHeader onClose={() => closeAddProductModal("variant")}>
              <CModalTitle>Add Product Variant</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {errorMessage ? (
                <CAlert color="danger">{errorMessage}</CAlert>
              ) : (
                ""
              )}
              <CRow>
                <CCol className="mb-2">
                  <CFormInput
                    label="Variant Name"
                    value={variantName}
                    style={{ textTransform: "uppercase" }}
                    onChange={(e) => setVariantName(e.target.value)}
                  />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => closeAddProductModal("variant")}
              >
                Close
              </CButton>
              <SubmitNewVariant />
            </CModalFooter>
          </CModal>
          {/* end product source modal */}
          {/* edit product */}
          <CModal
            size="lg"
            backdrop="static"
            alignment="center"
            visible={editProductModal}
            onClose={() => setEditProductModal(false)}
          >
            <CModalHeader onClose={() => setEditProductModal(false)}>
              <CModalTitle>Edit Product</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {
                loadingEditModal ?
                <Loader height={'40vh'} /> :
                <CContainer>
                  {errorMessage ? <CAlert color="danger" dismissible>{errorMessage}</CAlert> : ''}
                  <CRow>
                    <CCol md={6} className="mb-2">
                      <CFormInput
                        label="Product Name"
                        value={productEditName}
                        style={{ textTransform: "uppercase" }}
                        onChange={(e) => setProductEditName(e.target.value)}
                      />
                    </CCol>
                    <CCol md={6} className="mb-2">
                      <CFormSelect
                        label="Product Category"
                        value={productEditCategoryId}
                        onChange={(e) => setProductEditCategoryId(e.target.value)}
                      >
                        <option value="">Choose Product Category</option>
                        {productCategory?.map((res) => (
                          <option key={res.id} value={res.id}>
                            {res.product_category_name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={6} className="mb-2">
                      <CFormSelect
                        label="Product Variant"
                        value={productEditVariantId}
                        onChange={(e) => setProductEditVariantId(e.target.value)}
                      >
                        <option value="">Choose Product Variant</option>
                        {productVariant?.map((res) => (
                          <option key={res.id} value={res.id}>
                            {res.product_variant_name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={6} className="mb-2">
                      <CFormSelect
                        label="Product Source"
                        value={productEditSourceId}
                        onChange={(e) => setProductEditSourceId(e.target.value)}
                      >
                        <option value="">Choose Product Source</option>
                        {productSource?.map((res) => (
                          <option key={res.id} value={res.id}>
                            {res.product_source_name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={4} className="mb-2">
                      <CFormInput
                        label="Product Size"
                        value={productEditSize}
                        onChange={(e) => setProductEditSize(e.target.value)}
                      />
                    </CCol>
                    <CCol md={4} className="mb-2">
                      <CFormSelect
                        label="Product Unit"
                        value={productEditUnit}
                        onChange={(e) => setProductEditUnit(e.target.value)}
                      >
                        <option value="">Choose Product Unit</option>
                        <option>Gram</option>
                        <option>Pcs</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={4} className="mb-2">
                      <CFormInput
                        label="Product Point"
                        value={productEditPoint}
                        onChange={(e) => setProductEditPoint(e.target.value)}
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={6} className="mb-2">
                      <CFormInput
                        label="Capital Amount"
                        value={productEditCapitalAmount}
                        onChange={(e) => setProductEditCapitalAmount(e.target.value)}
                      />
                    </CCol>
                    <CCol md={6} className="mb-2">
                      <CFormInput
                        label="Sale Amount"
                        value={productEditSaleAmount}
                        onChange={(e) => setProductEditSaleAmount(e.target.value)}
                      />
                    </CCol>
                  </CRow>
                  <hr className="divider" />
                  <CRow>
                    <CCol md={6} className="mb-2">Current Product Image</CCol>
                    <CCol md={6} className="mb-2">
                      {
                        getDocument ?
                        <CBadge color="primary">
                          <a style={{ textDecoration: 'none', color: 'white' }} href={process.env.REACT_APP_API_URL+'/documents/'+getDocument} target="_blank">View</a>
                        </CBadge> : <CBadge color="warning">No Image</CBadge>
                      }
                      <CBadge color="success ms-2" onClick={() => setChangeDocument(!changeDocument)}>Change Image</CBadge>
                    </CCol>
                  </CRow>
                </CContainer>
              }
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => setEditProductModal(false)}
              >
                Close
              </CButton>
              <SubmitEditProduct />
            </CModalFooter>
          </CModal>
          {/* end edit product */}
          {/* change document modal */}
          <CModal
            size="md"
            backdrop="static"
            alignment="center"
            visible={changeDocument}
            onClose={() => setChangeDocument(false)}
          >
            <CModalHeader onClose={() => setChangeDocument(false)}>
              <CModalTitle>Change Image</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow>
                  <CCol md={12} classNam="mb-2">
                    <CFormInput
                      type="file"
                      id="document"
                      label="Upload Product Image"
                      onChange={inputEditFiles}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={3} className="mb-2 mt-2 mt-md-4"></CCol>
                  <CCol md={6} className="mb-2 mt-2 mt-md-4">
                    <img src={documentEditPreview} width="100%" />
                  </CCol>
                  <CCol md={3} className="mb-2 mt-2 mt-md-4"></CCol>
                </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => setChangeDocument(false)}
              >
                Close
              </CButton>
              <SubmitChangeDocument />
            </CModalFooter>
          </CModal>
          {/* end change document modal */}
          <CTable
            align="middle"
            className="text-center mt-2"
            responsive
            striped
            hover
            bordered
          >
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                <CTableHeaderCell scope="col">Source</CTableHeaderCell>
                <CTableHeaderCell scope="col">Variant</CTableHeaderCell>
                <CTableHeaderCell scope="col">Size</CTableHeaderCell>
                <CTableHeaderCell scope="col">Capital Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col">Sale Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody id="tesprint">
              {product?.map((product, i) => (
                <CTableRow key={product.id}>
                  <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                  <CTableDataCell>
                    {product.product_document ? (
                      <a
                        href={
                          process.env.REACT_APP_API_URL +
                          "/documents/" +
                          product.product_document
                        }
                        target="_blank"
                      >
                        <img
                          src={
                            process.env.REACT_APP_API_URL +
                            "/documents/" +
                            product.product_document
                          }
                          width="100"
                        />
                      </a>
                    ) : (
                      <img src={imageUnavailable} width="100" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell style={{ textTransform: "uppercase" }}>
                    {product.product_name}
                  </CTableDataCell>
                  <CTableDataCell style={{ textTransform: "uppercase" }}>
                    {product.category.product_category_name}
                  </CTableDataCell>
                  <CTableDataCell style={{ textTransform: "uppercase" }}>
                    {product.source.product_source_name}
                  </CTableDataCell>
                  <CTableDataCell style={{ textTransform: "uppercase" }}>
                    {product.variant.product_variant_name}
                  </CTableDataCell>
                  <CTableDataCell>
                    {product.product_size + " " + product.product_size_unit}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CurrencyFormat
                      value={product.product_capital_amount}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"IDR "}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CurrencyFormat
                      value={product.product_sale_amount}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"IDR "}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CDropdown>
                      <CDropdownToggle
                        style={{
                          backgroundColor: "transparent",
                          color: "black",
                          borderColor: "black",
                        }}
                      >
                        Action
                      </CDropdownToggle>
                      <CDropdownMenu>
                        {/* <CDropdownItem component="button" data-id={product.id} onClick={() => detailProduct(product.id)}>Detail</CDropdownItem> */}
                        <CDropdownItem
                          component="button"
                          data-id={product.id}
                          onClick={() => editProduct(product.id)}
                        >
                          Detail/Edit
                        </CDropdownItem>
                        <CDropdownItem component="button" data-id={product.id} onClick={() => handlePrint(product.id)}>
                          Print Label
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CContainer>
      )}
    </Layout>
  );
};

export default Product;
