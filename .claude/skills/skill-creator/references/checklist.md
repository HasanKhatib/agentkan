# Pre-ship checklist

Run before finalizing any skill.

## Core quality

- [ ] `description` is specific and includes key trigger terms
- [ ] `description` states both WHAT and WHEN
- [ ] `description` is third person
- [ ] `name` is lowercase-hyphenated, ≤64 chars, no reserved words
- [ ] SKILL.md body is under 500 lines
- [ ] No time-sensitive information (or moved to "Old patterns")
- [ ] Consistent terminology throughout
- [ ] Examples are concrete, not abstract
- [ ] File references are one level deep from SKILL.md
- [ ] Workflows have clear sequential steps
- [ ] Boundaries section lists hard rules

## Structure

- [ ] `SKILL.md` exists with valid YAML frontmatter
- [ ] Reference files use descriptive names (`note-types.md` not `doc2.md`)
- [ ] Forward slashes in all paths
- [ ] Progressive disclosure — essentials in SKILL.md, detail in references

## Scripts (if any)

- [ ] Scripts solve problems; errors handled explicitly
- [ ] No magic constants without justification
- [ ] Required packages documented and available on target surface
- [ ] Instructions say execute vs read-as-reference
- [ ] Validation step for critical operations

## Testing

- [ ] `scripts/validate.sh` passes
- [ ] Tested on three representative scenarios
- [ ] Skill triggers on expected user phrasing
- [ ] Agent reads only relevant reference files for each scenario

## Security

- [ ] All bundled files reviewed (instructions, scripts, assets)
- [ ] No unexpected network calls or file access patterns
- [ ] External URL fetches documented and justified
