// src/components/GenealogyTreeD3/GenealogyTreeD3.jsx

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as d3 from "d3";

import { useFormValidation } from "../../hooks/useFormValidation";
import { saveFamilyData, getFamilyData } from "../../utils/storage";
import defaultTree from "../../data/defaultTree.json";

import "../../blocks/genealogyTree.css";

export default function GenealogyTreeD3({
  data,
  setData,
  isExpanded,
  setIsExpanded,
}) {
  const containerRef = useRef();
  const svgRef = useRef();
  const zoomRef = useRef();
  const centerXRef = useRef(0);
  const focusNodeIdRef = useRef(null);

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { t } = useTranslation("genealogyTreeD3");

  const validationSchema = {
    name: "name",
    relation: "required",
    place: null,
    born: "date",
    death: "date",
    photo: "image",
    file: null,
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
  } = useFormValidation(
    {
      name: "",
      relation: "",
      place: "",
      born: "",
      death: "",
      photo: "",
      file: "",
      showImage: false,
    },
    validationSchema,
    t,
  );

  const hasErrors = Object.keys(errors).length > 0;

  /* ================= API ================= */
  useEffect(() => {
    const saved = getFamilyData();

    if (saved) {
      setData(saved);
    } else {
      setData(defaultTree);
      saveFamilyData(defaultTree);
    }
  }, [setData]);

  /* ================= D3 ================= */
  useEffect(() => {
    if (!data || !containerRef.current) return;

    const timeout = setTimeout(() => {
      const { width } = containerRef.current.getBoundingClientRect();
      if (!width) return;

      function update() {
        // 1. DATA + LAYOUT
        const root = d3.hierarchy(data);
        const treeLayout = d3.tree().nodeSize([160, 180]);

        treeLayout(root);

        const nodes = root.descendants();

        const minX = d3.min(nodes, (d) => d.x);
        const maxX = d3.max(nodes, (d) => d.x);
        const centerX = (minX + maxX) / 2;

        centerXRef.current = centerX;

        const links = root.links();

        // 2. DIMENSIONS
        const maxY = d3.max(root.descendants(), (d) => d.y);
        const height = Math.max(500, maxY + 200);

        // 3. CLEAR
        d3.select(containerRef.current).select("svg").remove();

        // 4. SVG
        const svgEl = d3
          .select(containerRef.current)
          .append("svg")
          .attr("class", "genealogy-tree__svg")
          .attr("width", "100%")
          .attr("height", height);

        svgRef.current = svgEl;

        // 5. PRINCIPAL GROUP
        const g = svgEl.append("g");

        // 6. ZOON
        const zoom = d3
          .zoom()
          .scaleExtent([0.5, 2])
          .on("zoom", (event) => {
            g.attr("transform", event.transform);
          });

        svgEl.call(zoom);
        if (!focusNodeIdRef.current) {
          svgEl.call(zoom.transform, d3.zoomIdentity.translate(width / 2, 80));
        }

        zoomRef.current = zoom;

        if (focusNodeIdRef.current) {
          const targetNode = nodes.find(
            (n) =>
              n.data.id === focusNodeIdRef.current ||
              n.data.spouse?.id === focusNodeIdRef.current,
          );

          if (targetNode) {
            const { width } = containerRef.current.getBoundingClientRect();
            const scale = 1.2;

            const x = width / 2 - targetNode.x * scale;
            const y = 100 - targetNode.y * scale;

            svgRef.current
              .transition()
              .duration(700)
              .call(
                zoomRef.current.transform,
                d3.zoomIdentity.translate(x, y).scale(scale),
              );

            setTimeout(() => {
              const nodeEl = g
                .selectAll(".genealogy-tree__node")
                .filter((d) => {
                  return (
                    d.data.id === targetNode.data.id ||
                    d.data.spouse?.id === targetNode.data.id
                  );
                })
                .select("circle");

              nodeEl.classed("genealogy-tree__node-highlight", true);

              setTimeout(() => {
                nodeEl.classed("genealogy-tree__node-highlight", false);
              }, 800);
            }, 700); // Wait for the zoom to finish.

            focusNodeIdRef.current = null;
          }
        }

        const defs = svgEl.append("defs");

        /* GLOBAL DROP SHADOW */
        defs
          .append("filter")
          .attr("id", "shadow")
          .append("feDropShadow")
          .attr("dx", 0)
          .attr("dy", 2)
          .attr("stdDeviation", 2)
          .attr("flood-opacity", 0.2);

        /* PRINCIPAL PHOTO */
        defs
          .append("clipPath")
          .attr("id", "clipCircle")
          .append("circle")
          .attr("r", 18)
          .attr("cx", 0)
          .attr("cy", 0);

        /* SPOUSE PHOTO */
        defs
          .append("clipPath")
          .attr("id", "clipCircleSmall")
          .attr("clipPathUnits", "objectBoundingBox")
          .append("circle")
          .attr("cx", 0.5)
          .attr("cy", 0.5)
          .attr("r", 0.5);

        /* LINKS */
        g.selectAll(".genealogy-tree__link")
          .data(links, (d) => d.target.data.id)
          .join("path")
          .attr("class", "genealogy-tree__link")
          .attr(
            "d",
            d3
              .linkVertical()
              .x((d) => d.x)
              .y((d) => d.y),
          );

        /* NODES */
        const node = g
          .selectAll(".genealogy-tree__node")
          .data(nodes, (d) => d.data.id);

        node.selectAll("text").remove();

        const nodeEnter = node
          .enter()
          .append("g")
          .attr("class", "genealogy-tree__node")
          .on("click", (event, d) => {
            event.stopPropagation();
            setSelectedPerson({ ...d.data, type: "person" });
            setValues(d.data);
            setIsEditing(false);
          })
          .attr("pointer-events", "all");

        nodeEnter
          .merge(node)
          .selectAll("title")
          .data((d) => [d])
          .join("title")
          .text((d) => `${d.data.name} (${d.data.relation || ""})`);

        /* ================= PRINCIPAL ================= */

        /* CIRCLE */
        nodeEnter
          .append("circle")
          .attr("r", 18)
          .attr("class", "genealogy-tree__node-circle")
          .attr("filter", "url(#shadow)")
          .style("pointer-events", "all")
          .style("cursor", "pointer");

        /* IMAGE */
        nodeEnter
          .append("image")
          .attr("class", "genealogy-tree__photo")
          .attr("visibility", "hidden")
          .attr("x", -18)
          .attr("y", -18)
          .attr("width", 36)
          .attr("height", 36)
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("clip-path", "url(#clipCircle)")
          .attr("filter", "url(#shadow)")
          .style("object-fit", "cover")
          .style("pointer-events", "none")
          .style("cursor", "pointer");

        /* LINE */
        nodeEnter
          .filter((d) => d.data.spouse)
          .append("line")
          .attr("x1", 18)
          .attr("y1", 0)
          .attr("x2", 66)
          .attr("y2", 0)
          .attr("stroke", "#cbd5e1")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "3,3");

        /* HOVER */
        nodeEnter
          .merge(node)
          .select(".genealogy-tree__node-circle")
          .on("mouseover", function () {
            d3.select(this).transition().duration(200).attr("r", 22);
          })
          .on("mouseout", function () {
            d3.select(this).transition().duration(200).attr("r", 18);
          });

        /* CHECKBOX IMAGE*/
        nodeEnter
          .merge(node)
          .select(".genealogy-tree__photo")
          .attr("href", (d) => {
            const img = d.data.showImage ? d.data.photo : null;
            if (!img || img.startsWith("blob:")) return null;
            return img;
          })
          .attr("xlink:href", (d) => {
            const img = d.data.showImage ? d.data.photo : null;
            if (!img || img.startsWith("blob:")) return null;
            return img;
          })
          .attr("visibility", (d) =>
            d.data.showImage && d.data.photo ? "visible" : "hidden",
          );

        /* TEXT */
        nodeEnter
          .append("text")
          .attr("class", "genealogy-tree__text")
          .attr("dy", 35)
          .attr("text-anchor", "middle")
          .text((d) => d.data.name);

        nodeEnter
          .append("text")
          .attr("class", "genealogy-tree__text--muted")
          .attr("dy", 50)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text((d) => (d.data.born ? `b. ${d.data.born}` : ""));

        nodeEnter
          .append("text")
          .attr("class", "genealogy-tree__text--muted")
          .attr("dy", 62)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text((d) => (d.data.death ? `d. ${d.data.death}` : ""));

        /* ================= SPOUSE ================= */

        /* CIRCLE */
        nodeEnter
          .filter((d) => d.data.spouse)
          .append("circle")
          .attr(
            "class",
            "genealogy-tree__node-circle genealogy-tree__node-circle--spouse",
          )
          .attr("cx", 80)
          .attr("r", 14)
          .attr("fill", "#fdf2f8")
          .attr("stroke", "#ec4899")
          .attr("stroke-width", 2)
          .attr("visibility", (d) => (d.data.spouse ? "visible" : "hidden"))
          .attr("filter", "url(#shadow)")
          .style("pointer-events", "all")
          .style("cursor", "pointer")
          .on("click", (event, d) => {
            event.stopPropagation();
            event.preventDefault();
            setSelectedPerson({
              ...d.data.spouse,
              parentId: d.data.id,
              type: "spouse",
            });
            setValues({
              ...d.data.spouse,
              showImage: d.data.spouse?.showImage ?? false,
            });
            setIsEditing(false);
          });

        nodeEnter
          .merge(node)
          .style("opacity", 0)
          .transition()
          .duration(500)
          .style("opacity", 1);

        nodeEnter
          .merge(node)
          .attr("transform", (d) => `translate(${d.x},${d.y})`);

        /* IMAGE */
        nodeEnter
          .filter((d) => d.data.spouse)
          .append("image")
          .attr("class", "genealogy-tree__photo genealogy-tree__photo--spouse")
          .attr("width", 28)
          .attr("height", 28)
          .attr("x", 66)
          .attr("y", -14)
          .attr("clip-path", "url(#clipCircleSmall)")
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("filter", "url(#shadow)")
          .style("cursor", "pointer");

        /* UPDATE */
        nodeEnter
          .merge(node)
          .filter((d) => d.data.spouse)
          .selectAll(".genealogy-tree__photo--spouse")
          .attr("href", (d) => {
            const img = d.data.spouse?.showImage ? d.data.spouse?.photo : null;
            return img && !img.startsWith("blob:") ? img : null;
          })
          .attr("xlink:href", (d) => {
            const img = d.data.spouse?.showImage ? d.data.spouse?.photo : null;
            return img && !img.startsWith("blob:") ? img : null;
          })
          .attr("visibility", (d) =>
            d.data.spouse?.showImage && d.data.spouse?.photo
              ? "visible"
              : "hidden",
          )
          .attr("stroke", "#fff")
          .attr("stroke-width", 2)
          .transition()
          .duration(400);

        /* HOVER */
        nodeEnter
          .merge(node)
          .filter((d) => d.data.spouse)
          .selectAll(".genealogy-tree__photo--spouse")
          .on("mouseover", function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("width", 36)
              .attr("height", 36)
              .attr("filter", "brightness(1.1)")
              .style("transform", "scale(1.05)");
          })
          .on("mouseout", function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("width", 28)
              .attr("height", 28)
              .attr("filter", "brightness(1)");
          });

        nodeEnter
          .filter((d) => d.data.spouse)
          .append("text")
          .attr("class", "genealogy-tree__text")
          .attr("dx", 45)
          .attr("dy", 85)
          .attr("text-anchor", "start")
          .text((d) => d.data.spouse.name);

        nodeEnter
          .filter((d) => d.data.spouse)
          .merge(node.filter((d) => d.data.spouse))
          .selectAll(".genealogy-tree__spouse--born")
          .data((d) => [d])
          .join("text")
          .attr("class", "genealogy-tree__spouse--born")
          .attr("dx", 75)
          .attr("dy", 102)
          .attr("text-anchor", "start")
          .text((d) => (d.data.spouse?.born ? `b. ${d.data.spouse.born}` : ""));

        nodeEnter
          .filter((d) => d.data.spouse)
          .merge(node.filter((d) => d.data.spouse))
          .selectAll(".genealogy-tree__spouse--death")
          .data((d) => [d])
          .join("text")
          .attr("class", "genealogy-tree__spouse--death")
          .attr("dx", 75)
          .attr("dy", 116)
          .text((d) =>
            d.data.spouse?.death ? `d. ${d.data.spouse.death}` : "",
          );

        node.exit().remove();
      }

      update();
    }, 0);

    return () => clearTimeout(timeout);
  }, [data]);

  /* ================= IMAGE RESIZE ================= */
  function resizeImage(file, maxSize = 200) {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = maxSize / img.width;

        canvas.width = maxSize;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };

      reader.readAsDataURL(file);
    });
  }

  /* ================= FORM ================= */
  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const resizedImage = await resizeImage(file);

    setValues((prev) => ({
      ...prev,
      photo: resizedImage,
      fileName: file.name,
    }));
  }

  function handleFormChange(e) {
    handleChange(e);
  }

  /* ================= SAVE ================= */
  function handleSave() {
    const isValid = validateAll();

    if (!isValid) return;

    if (values.born && values.death) {
      function parseDate(dateString) {
        // yyyy-mm-dd
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          return new Date(dateString);
        }

        // dd/mm/yyyy
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
          const [day, month, year] = dateString.split("/");

          return new Date(year, month - 1, day);
        }

        return null;
      }

      const bornDate = parseDate(values.born);
      const deathDate = parseDate(values.death);

      if (bornDate && deathDate) {
        if (deathDate < bornDate) {
          setErrors((prev) => ({
            ...prev,
            death: t("deathBeforeBirth", { ns: "validation" }),
          }));

          return;
        }
      }
    }

    setIsSaving(true);

    setTimeout(() => {
      let focusId = null;

      function updateNode(node) {
        if (selectedPerson.type === "person" && node.id === selectedPerson.id) {
          focusId = node.id;
          return { ...node, ...values };
        }

        if (
          selectedPerson.type === "spouse" &&
          node.id === selectedPerson.parentId
        ) {
          focusId = node.id;
          return {
            ...node,
            spouse: {
              ...(node.spouse || {}),
              ...values,
              showImage: values.showImage ?? false,
            },
          };
        }

        if (node.children) {
          return {
            ...node,
            children: node.children.map(updateNode),
          };
        }

        return node;
      }

      const updated = updateNode(data) || data;

      focusNodeIdRef.current = focusId;

      setData(updated);
      saveFamilyData(updated);

      setSelectedPerson(null);
      setIsEditing(false);
      setIsSaving(false);
    }, 500);
  }

  /* ================= ADD ================= */
  function handleAddChild() {
    const newId = Date.now().toString(); // novo

    const newChild = {
      id: newId,
      name: "",
      relation: "Child",
      children: [],
      spouse: null,
      showImage: false,
    };

    focusNodeIdRef.current = newId;

    function add(node) {
      if (node.id === selectedPerson.id) {
        return {
          ...node,
          children: node.children ? [...node.children, newChild] : [newChild],
        };
      }

      if (node.children) {
        return { ...node, children: node.children.map(add) };
      }

      return node;
    }

    const updated = add(data);
    setData(updated);
    saveFamilyData(updated);

    setSelectedPerson(null); // modal closes
    setIsExpanded(true); // maintains expanded layout
  }

  function handleAddSpouse() {
    const newId = Date.now().toString(); // novo

    focusNodeIdRef.current = newId;

    function add(node) {
      if (node.id === selectedPerson.id) {
        return {
          ...node,
          spouse: {
            id: newId,
            name: "",
            relation: "Spouse",
            showImage: false,
          },
        };
      }

      if (node.children) {
        return { ...node, children: node.children.map(add) };
      }

      return node;
    }

    const updated = add(data);
    setData(updated);
    saveFamilyData(updated);

    setSelectedPerson(null);
    setIsExpanded(true);
  }

  /* ================= DELETE ================= */
  function handleDelete() {
    setIsDeleting(true);

    setTimeout(() => {
      let focusId = null;

      function remove(node) {
        if (
          selectedPerson.type === "spouse" &&
          node.id === selectedPerson.parentId
        ) {
          focusId = node.id;
          return {
            ...node,
            spouse: null,
          };
        }

        if (!node.children || node.children.length === 0) return node;

        if (node.children.some((c) => c.id === selectedPerson.id)) {
          focusId = node.id; // parent node
        }

        return {
          ...node,
          children: node.children
            .filter((c) => c.id !== selectedPerson.id)
            .map(remove),
        };
      }

      const updated = remove(data);

      focusNodeIdRef.current = focusId;

      setData(updated);
      saveFamilyData(updated);

      setSelectedPerson(null);
      setIsDeleting(false);
      setConfirmDelete(false);
    }, 400);
  }

  /* ================= ZOOM ================= */
  function zoomIn() {
    svgRef.current.transition().call(zoomRef.current.scaleBy, 1.2);
  }

  function zoomOut() {
    svgRef.current.transition().call(zoomRef.current.scaleBy, 0.8);
  }

  function resetZoom() {
    const { width } = containerRef.current.getBoundingClientRect();

    svgRef.current
      .transition()
      .call(
        zoomRef.current.transform,
        d3.zoomIdentity.translate(width / 2, 80),
      );
  }

  /* ================= TXT EXPORT ================= */
  const removeImages = (person) => {
    if (!person) return person;

    return {
      ...person,

      photo: undefined,

      spouse: person.spouse
        ? {
            ...removeImages(person.spouse),
            photo: undefined,
          }
        : null,

      children: person.children ? person.children.map(removeImages) : [],
    };
  };

  const downloadTreeJson = () => {
    const cleanData = removeImages(data);

    const json = JSON.stringify(cleanData, null, 2);

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "genealogy-tree.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="genealogy-tree">
      <div className="genealogy-tree__controls">
        <button className="genealogy-tree__button" onClick={zoomIn}>
          ＋
        </button>

        <button className="genealogy-tree__button" onClick={zoomOut}>
          －
        </button>

        <button className="genealogy-tree__button" onClick={resetZoom}>
          ⟲
        </button>

        <button className="genealogy-tree__button" onClick={downloadTreeJson}>
          ⤓
        </button>

        <button
          className="genealogy-tree__button"
          onClick={() => setIsExpanded(false)}
        >
          ←
        </button>
      </div>

      <div className="genealogy-tree__container" ref={containerRef}></div>

      {selectedPerson && (
        <div
          className="genealogy-tree__modal"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="genealogy-tree__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="genealogy-tree__modal-close"
              onClick={() => setSelectedPerson(null)}
            >
              ✕
            </button>

            <div className="genealogy-tree__modal-body">
              <img
                src={values.photo || "/default-avatar.png"}
                className="genealogy-tree__modal-image"
              />

              {confirmDelete ? (
                <>
                  <h3 className="genealogy-tree__modal-confirme">
                    {t("confirmDelete")}
                  </h3>

                  <p className="genealogy-tree__modal-paragraph">
                    {t("confirmMessage", { name: values.name })}
                  </p>

                  <div className="genealogy-tree__modal-actions">
                    <button
                      className={`genealogy-tree__modal-del ${
                        isDeleting ? "disabled" : ""
                      }`}
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? t("deleting") : t("yesDelete")}
                    </button>

                    <button
                      className="genealogy-tree__modal-cancel"
                      onClick={() => setConfirmDelete(false)}
                      disabled={isDeleting}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </>
              ) : !isEditing ? (
                <>
                  <h2 className="genealogy-tree__modal-text">{values.name}</h2>

                  <p className="genealogy-tree__modal-paragraph">
                    <p className="genealogy-tree__modal-paragraph">
                      {values.relation ? t(values.relation) : ""}
                    </p>
                  </p>

                  <p className="genealogy-tree__modal-paragraph">
                    {values.place}
                  </p>

                  <button
                    className="genealogy-tree__modal-edit"
                    onClick={() => setIsEditing(true)}
                  >
                    🖊️ {t("edit")}
                  </button>

                  {selectedPerson.type === "person" && (
                    <>
                      <button
                        className="genealogy-tree__modal-add"
                        onClick={handleAddChild}
                      >
                        ➕ {t("addChild")}
                      </button>

                      <button
                        className="genealogy-tree__modal-conjuge"
                        onClick={handleAddSpouse}
                      >
                        💍 {t("addSpouse")}
                      </button>
                    </>
                  )}

                  <button
                    className={`genealogy-tree__modal-del ${
                      isDeleting ? "disabled" : ""
                    }`}
                    onClick={() => setConfirmDelete(true)}
                    disabled={isDeleting}
                  >
                    🗑️ {t("delete")}
                  </button>
                </>
              ) : (
                <>
                  <input
                    name="name"
                    value={values.name || ""}
                    onChange={handleFormChange}
                    onBlur={handleBlur}
                    placeholder={t("fullName")}
                    className={`genealogy-tree__modal-input ${
                      errors.name && touched.name ? "input-error" : ""
                    }`}
                  />

                  {errors.name && touched.name && (
                    <span className="input-error-message">{errors.name}</span>
                  )}

                  <select
                    name="relation"
                    value={values.relation || ""}
                    onChange={handleFormChange}
                    onBlur={handleBlur}
                    className={`genealogy-tree__modal-input ${
                      errors.relation && touched.relation ? "input-error" : ""
                    }`}
                  >
                    <option value="">{t("relation")}</option>

                    <option value="child">{t("child")}</option>

                    <option value="father">{t("father")}</option>
                    <option value="mother">{t("mother")}</option>

                    <option value="grandfather">{t("grandfather")}</option>
                    <option value="grandmother">{t("grandmother")}</option>

                    <option value="secondGrandfather">
                      {t("secondGrandfather")}
                    </option>

                    <option value="secondGrandmother">
                      {t("secondGrandmother")}
                    </option>

                    <option value="thirdGrandfather">
                      {t("thirdGrandfather")}
                    </option>

                    <option value="thirdGrandmother">
                      {t("thirdGrandmother")}
                    </option>

                    <option value="fourthGrandfather">
                      {t("fourthGrandfather")}
                    </option>

                    <option value="fourthGrandmother">
                      {t("fourthGrandmother")}
                    </option>

                    <option value="fifthGrandfather">
                      {t("fifthGrandfather")}
                    </option>

                    <option value="fifthGrandmother">
                      {t("fifthGrandmother")}
                    </option>

                    <option value="sixthGrandfather">
                      {t("sixthGrandfather")}
                    </option>

                    <option value="sixthGrandmother">
                      {t("sixthGrandmother")}
                    </option>

                    <option value="seventhGrandfather">
                      {t("seventhGrandfather")}
                    </option>

                    <option value="seventhGrandmother">
                      {t("seventhGrandmother")}
                    </option>

                    <option value="eighthGrandfather">
                      {t("eighthGrandfather")}
                    </option>

                    <option value="eighthGrandmother">
                      {t("eighthGrandmother")}
                    </option>
                  </select>

                  {errors.relation && touched.relation && (
                    <span className="input-error-message">
                      {errors.relation}
                    </span>
                  )}

                  <input
                    name="place"
                    value={values.place || ""}
                    onChange={handleFormChange}
                    onBlur={handleBlur}
                    placeholder={t("place")}
                    className={`genealogy-tree__modal-input ${
                      errors.place && touched.place ? "input-error" : ""
                    }`}
                  />

                  {errors.place && touched.place && (
                    <span className="input-error-message">{errors.place}</span>
                  )}

                  <label className="genealogy-tree__modal-label">
                    {t("born")}
                  </label>
                  <input
                    type="date"
                    name="born"
                    value={values.born || ""}
                    onChange={handleFormChange}
                    onBlur={handleBlur}
                    className={`genealogy-tree__modal-input ${
                      errors.born && touched.born ? "input-error" : ""
                    }`}
                  />

                  {errors.born && touched.born && (
                    <span className="input-error-message">{errors.born}</span>
                  )}

                  <label className="genealogy-tree__modal-label">
                    {t("death")}
                  </label>
                  <input
                    type="date"
                    name="death"
                    value={values.death || ""}
                    onChange={handleFormChange}
                    onBlur={handleBlur}
                    className={`genealogy-tree__modal-input ${
                      errors.death && touched.death ? "input-error" : ""
                    }`}
                  />

                  {errors.death && touched.death && (
                    <span className="input-error-message">{errors.death}</span>
                  )}

                  <input
                    name="photo"
                    value={values.photo || ""}
                    onChange={handleFormChange}
                    onBlur={handleBlur}
                    placeholder={t("image")}
                    className={`genealogy-tree__modal-input ${
                      errors.photo && touched.photo ? "input-error" : ""
                    }`}
                  />

                  {errors.photo && touched.photo && (
                    <span className="input-error-message">{errors.photo}</span>
                  )}

                  <label className="genealogy-tree__upload">
                    {t("chooseImage")}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      onBlur={handleBlur}
                      hidden
                    />
                  </label>

                  <span className="genealogy-tree__file-name">
                    {values.fileName || t("noFile")}
                  </span>

                  <label className="genealogy-tree__modal-label">
                    <input
                      type="checkbox"
                      name="showImage"
                      checked={values.showImage || false}
                      onChange={handleFormChange}
                      onBlur={handleBlur}
                      className={`genealogy-tree__modal-input ${
                        errors.showImage && touched.showImage
                          ? "input-error"
                          : ""
                      }`}
                    />
                    {errors.showImage && touched.showImage && (
                      <span className="input-error-message">
                        {errors.showImage}
                      </span>
                    )}
                    {t("showImage")}
                  </label>

                  <div className="genealogy-tree__modal-actions">
                    <button
                      className={`genealogy-tree__modal-save ${
                        hasErrors || isSaving ? "disabled" : ""
                      }`}
                      onClick={handleSave}
                      disabled={hasErrors || isSaving}
                    >
                      {isSaving ? t("saving") : t("save")}
                    </button>

                    <button
                      className="genealogy-tree__modal-cancel"
                      onClick={() => setIsEditing(false)}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
