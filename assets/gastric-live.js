/* Live lists for the gastric ultrasound section: PubMed (publications) and ClinicalTrials.gov (ongoing research).
   Each list is fetched when the page opens; if the service cannot be reached, the saved snapshot is shown. */
(function () {
  "use strict";
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function $(s) { return document.querySelector(s); }
  var SNAP = window.GASTRIC_SNAP || { pubs: [], trials: [], date: "" };
  var TERM = '("gastric ultrasound"[tiab] OR "gastric point-of-care ultrasound"[tiab] OR "gastric POCUS"[tiab] OR "gastric sonography"[tiab] OR "gastric ultrasonography"[tiab] OR "ultrasound assessment of gastric"[tiab]) AND (anesthesia OR anaesthesia OR aspiration OR fasting OR "gastric volume" OR "gastric content")';
  var EU = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
  function status(el, live) { if (el) el.textContent = live ? "Updated from the source just now." : "Showing the list saved on " + SNAP.date + ". The live service could not be reached."; }
  function pubRow(p) {
    return '<tr><td><a href="https://pubmed.ncbi.nlm.nih.gov/' + esc(p.id) + '/" target="_blank" rel="noopener">' + esc(p.title) + "</a><br><span class=\"muted\">" + esc(p.authors) + "</span></td><td>" + esc(p.journal) + "</td><td>" + esc(p.date) + "</td><td>" + (p.doi ? '<a href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">DOI</a>' : "") + "</td></tr>";
  }
  function showPubs(list, live) { var b = $("#gp-body"); if (!b) return; b.innerHTML = list.map(pubRow).join("") || '<tr><td colspan="4">No results.</td></tr>'; status($("#gp-status"), live); }
  function loadPubs() {
    if (!$("#gp-body")) return; showPubs(SNAP.pubs, false);
    fetch(EU + "esearch.fcgi?db=pubmed&retmode=json&retmax=30&sort=date&term=" + encodeURIComponent(TERM)).then(function (r) { return r.json(); }).then(function (j) {
      var ids = j.esearchresult.idlist; if (!ids.length) throw 0;
      return fetch(EU + "esummary.fcgi?db=pubmed&retmode=json&id=" + ids.join(",")).then(function (r) { return r.json(); }).then(function (s) {
        showPubs(ids.map(function (i) { var a = s.result[i], d = (a.articleids || []).filter(function (x) { return x.idtype === "doi"; })[0]; var au = (a.authors || []).map(function (x) { return x.name; }); return { id: i, title: a.title, authors: au.slice(0, 3).join(", ") + (au.length > 3 ? ", et al." : ""), journal: a.source, date: a.pubdate, doi: d ? d.value : "" }; }), true);
      });
    }).catch(function () { });
  }
  var ST = { RECRUITING: "Recruiting", NOT_YET_RECRUITING: "Not yet recruiting", ACTIVE_NOT_RECRUITING: "Active, not recruiting", ENROLLING_BY_INVITATION: "Enrolling by invitation" };
  function trial(s) { var p = s.protocolSection || {}, id = p.identificationModule || {}, st = p.statusModule || {}, sp = (p.sponsorCollaboratorsModule || {}).leadSponsor || {}, de = p.designModule || {}, loc = ((p.contactsLocationsModule || {}).locations || []).map(function (l) { return l.country; }).filter(function (v, i, a) { return v && a.indexOf(v) === i; });
    return { nct: id.nctId, title: id.briefTitle, status: ST[st.overallStatus] || st.overallStatus, sponsor: sp.name, n: (de.enrollmentInfo || {}).count, countries: loc.slice(0, 3).join(", ") + (loc.length > 3 ? " and others" : ""), start: (st.startDateStruct || {}).date, end: (st.primaryCompletionDateStruct || {}).date, updated: (st.lastUpdatePostDateStruct || {}).date }; }
  function trialRow(t) { return '<tr><td><a href="https://clinicaltrials.gov/study/' + esc(t.nct) + '" target="_blank" rel="noopener">' + esc(t.title) + '</a><br><span class="muted">' + esc(t.nct) + " · " + esc(t.sponsor) + "</span></td><td>" + esc(t.status) + "</td><td>" + esc(t.n || "") + "</td><td>" + esc(t.countries) + "</td><td>" + esc(t.start || "") + "</td><td>" + esc(t.end || "") + "</td></tr>"; }
  function showTrials(list, live) { var b = $("#gt-body"); if (!b) return; b.innerHTML = list.map(trialRow).join("") || '<tr><td colspan="6">No results.</td></tr>'; status($("#gt-status"), live); }
  function loadTrials() {
    if (!$("#gt-body")) return; showTrials(SNAP.trials, false);
    fetch("https://clinicaltrials.gov/api/v2/studies?query.term=" + encodeURIComponent('"gastric ultrasound" OR "gastric POCUS" OR "gastric sonography" OR "gastric ultrasonography"') + "&filter.overallStatus=RECRUITING,NOT_YET_RECRUITING,ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION&pageSize=40&sort=LastUpdatePostDate:desc").then(function (r) { return r.json(); }).then(function (j) { if (!j.studies || !j.studies.length) throw 0; showTrials(j.studies.map(trial), true); }).catch(function () { });
  }
  function chapters() { var v = $("#gv-video"); if (!v) return; [].forEach.call(document.querySelectorAll("[data-seek]"), function (b) { b.addEventListener("click", function () { v.currentTime = parseFloat(b.getAttribute("data-seek")); v.play(); v.scrollIntoView({ behavior: "smooth", block: "center" }); }); }); }
  function go() { loadPubs(); loadTrials(); chapters(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
