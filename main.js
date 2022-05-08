const targetNode = document.body;
const config = {
    childList: true,
    subtree: true
};
var ok = true

function matiere(e, u, coef) {
    notes = e.getElementsByClassName('valeur')
    for (j in notes) {
        if (notes[j].textContent != undefined) {
            var note = String(notes[j].textContent)
            note = note.split(' ').filter(function (f) {
                return f !== ''
            })
            if (note.length === 1) {
                coef = coef + 1
            }
            if (typeof (note[1]) != undefined && note[1] != null) {
                //Note /20
                if (note[1].startsWith('/')) {
                    note[1] = note[1].replace('/', '')
                    note[0] = note[0].replace(',', '.')
                    note[1] = note[1].replace(',', '.')
                    note[0] = parseFloat(note[0]) * 20 / parseFloat(note[1])
                    note.splice(1, 1)
                }
                //coef
                if (note.length === 1) {
                    coef = coef + 1
                } else {
                    note[1] = note[1].substring(1, (note[1].length - 1))
                    coef = coef + parseFloat(note[1])
                    var x = note[0]
                    if (typeof (x) === 'string') {
                        x = x.replace(',', '.')
                        x = parseFloat(x)
                    }
                    note[0] = x * parseFloat(note[1])
                    note.splice(1, 1)

                }

            }

            u.push(note)
        }

    }
    return {
        varu: function () {
            return u
        },
        varcoef: function () {
            return coef
        }
    }
}

const callback = function (mutationsList, observer) {
    var boucle = true
    var tableau_notes = document.querySelector("#encart-notes > table")
    for (let mutation of mutationsList) {

        if (mutation.type === 'childList') {
            // Elements have changed
            if (typeof (tableau_notes) != undefined && tableau_notes != null && ok) {
                ok = false
                var table = {}
                tr = tableau_notes.getElementsByTagName('tr')
                for (i in tr) {
                    var type = ""
                    if (typeof (tr[i].className) != undefined && tr[i].className != null) {
                        var u = []
                        var coef = 0
                        if (!tr[i].className.startsWith('master') && !tr[i].className.startsWith('secondary') && tr[i].className != undefined && tr[i].className != null) {
                            var mat = new matiere(tr[i], u, coef)
                            u = mat.varu()
                            coef = mat.varcoef()
                            type = "master"
                        }
                        if (tr[i].className.startsWith('secondary') && tr[i].className != undefined && tr[i].className != null) {
                            type = "secondary"
                            var mat = new matiere(tr[i], u, coef)
                            u = mat.varu()
                            coef = mat.varcoef()
                        }
                        if (tr[i].className.startsWith('master') && tr[i].className != undefined && tr[i].className != null) {
                            var secmoy = 0
                            var seccount = 0
                            var secondaire = tableau_notes.getElementsByClassName('secondary')

                            for (ele in secondaire) {
                                if (typeof (secondaire[ele]) == "object") {
                                    var mat = new matiere(secondaire[ele], [], 0)
                                    u = mat.varu()
                                    coef = mat.varcoef()

                                    if (u.length != 0 && coef != 0) {
                                        var moy = 0
                                        for (alpha in u) {
                                            var x = u[alpha][0]
                                            if (typeof (x) === 'string') {
                                                x = x.replace(',', '.')
                                                x = parseFloat(x)
                                                x.toFixed(2)
                                            }
                                            moy = moy + x


                                        }
                                        seccount = seccount + 1
                                        secmoy = (moy / coef) + secmoy

                                    }
                                }
                            }
                            if (seccount === 0) {
                                u = []
                                coef = 0
                            } else {
                                u = [
                                    [parseFloat(secmoy.toFixed(2))]
                                ]
                                coef = seccount
                            }
                            type = "master"


                        }
                        if (u.length != 0 && coef != 0) {
                            var moy = 0
                            for (alpha in u) {
                                var x = u[alpha][0]
                                if (typeof (x) === 'string') {
                                    x = x.replace(',', '.')
                                    x = parseFloat(x)
                                }
                                moy = moy + x

                            }
                            table[tr[i].getElementsByClassName('nommatiere')[0].textContent] = {
                                "moy": parseFloat((moy / coef).toFixed(2)),
                                "type": type
                            }
                        }
                    }
                }
                console.log(table)
                var moy = 0
                var coef = 0
                for (i in table) {
                    if (table[i]['type'] === "master") {
                        moy = table[i]['moy'] + moy
                        coef = coef + 1
                    }
                }
                var tableau = document.querySelector("#encart-notes > table")
                var nouvelle = tableau.insertRow(-1)

                nouvelle.className = "ng-star-inserted"
                nouvelle.innerHTML = `<td class="discipline"><span class="nommatiere"><b>Moyenne Générale</b></span></td><td class="notes"><span class="valeur ng-star-inserted">${(moy/coef).toFixed(2).replace('.', ',')}</span></td><td class="graph text-center"></td>`
                for (i in tr) {
                    if (typeof (tr[i].className) != undefined && tr[i].className != null) {
                        if (typeof (tr[i].getElementsByClassName('nommatiere')) != undefined && tr[i].getElementsByClassName('nommatiere').length != 0) {
                            if (tr[i].getElementsByClassName('nommatiere')[0].textContent in table) {
                                var moyenne = document.createElement('span')
                                var parentmoyenne = tr[i].querySelector("td.notes")
                                moyenne.className = "valeur ng-star-inserted"
                                moyenne.innerHTML = `<span style="color: #4F0CB6; font-weight: bold;" class="valeur ng-star-inserted"> ${table[tr[i].getElementsByClassName('nommatiere')[0].textContent]["moy"].toFixed(2).replace('.', ',')} </span>`
                                if (typeof (tr[i].querySelector("td.notes").getElementsByClassName('note')[0]) != undefined) {
                                    parentmoyenne.insertBefore(moyenne, tr[i].querySelector("td.notes").getElementsByClassName('note')[0])
                                }
                            }
                        }

                    }
                }
                break;
                return;
            }

        }
    }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);