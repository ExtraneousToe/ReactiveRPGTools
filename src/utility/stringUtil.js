export function sortAscending(a, b) {
  let x = a.toLowerCase();
  let y = b.toLowerCase();

  if (y < x) {
    return 1;
  }
  if (x < y) {
    return -1;
  }
  return 0;
}

export function stripTags(throughString) {
  const TAG_PATTERN = /(?<pre>.*){@(?<tag>\S*) (?<text>[^|]*)(?<filters>|.*)?}(?<post>.*)/g;

  let matchGroup = TAG_PATTERN.exec(throughString);
  //console.log(throughString + " => " + JSON.stringify(matchGroup.groups));

  if (false && matchGroup) {
    return matchGroup.groups.pre + " " + matchGroup.groups.text;
  } else {
    return throughString;
  }
}
