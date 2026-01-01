// import { useAppDispatch, useAppSelector } from "@/lib/store";
// import {
//   fetchDocs,
//   fetchDoc,
//   createDoc,
//   deleteDoc,
// } from "@/lib/store/docsSlice";

// export function useDocs() {
//   const dispatch = useAppDispatch();

//   const docs = useAppSelector((state) => state.docs.list);
//   const currentDoc = useAppSelector((state) => state.docs.current);

//   return {
//     docs,
//     currentDoc,

//     getDocs: (projectId) =>
//       dispatch(fetchDocs(projectId)),

//     getDoc: (docId) =>
//       dispatch(fetchDoc(docId)),

//     createDoc: (payload) => dispatch(createDoc(payload)),

//     deleteDoc: (docId) =>
//       dispatch(deleteDoc(docId)),
//   };
// }


'use client'

import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  fetchDocs,
  fetchDoc,
  createDoc,
  deleteDoc,
//   listDocFiles,
//   uploadDocFile,
  deleteDocFile,
} from '../features/docs/docSlice'

export function useDocs() {
  const dispatch = useAppDispatch()

  const {
    list,
    current,
    filesByDoc,
    loading,
    uploading,
    error,
  } = useAppSelector((state) => state.docs)

  /* ---------------- DOC CRUD ---------------- */

  const getDocs = (projectId) =>
    dispatch(fetchDocs({ projectId }))

  const getDoc = (docId) =>
    dispatch(fetchDoc({ docId }))

  const createNewDoc = ({
    projectId,
    title,
    content,
  }) =>
    dispatch(createDoc({ projectId, title, content }))

  const removeDoc = (docId) =>
    dispatch(deleteDoc({ docId }))

  /* ---------------- DOC FILES ---------------- */

  const getDocFiles = (docId) =>
    dispatch(listDocFiles({ docId }))

  const uploadFileToDoc = ({
    projectId,
    docId,
    file,
  }) =>
    dispatch(uploadDocFile({ projectId, docId, file }))

  const removeDocFile = ({
    docId,
    fileId,
  }) =>
    dispatch(deleteDocFile({ docId, fileId }))

  /* ---------------- SELECTORS ---------------- */

  const getFilesByDoc = (docId) =>
    filesByDoc[docId] || []

  return {
    /* state */
    list,
    current,
    loading,
    uploading,
    error,

    /* doc actions */
    getDocs,
    getDoc,
    createNewDoc,
    removeDoc,

    /* file actions */
    getDocFiles,
    uploadFileToDoc,
    removeDocFile,

    /* selectors */
    getFilesByDoc,
  }
}
