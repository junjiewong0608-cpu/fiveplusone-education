const assert = require('node:assert/strict');
const { test } = require('node:test');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(projectRoot, 'assets', '8bit', '8bit-character-manifest.json'), 'utf8'));
const orientationOverrides = JSON.parse(fs.readFileSync(path.join(projectRoot, 'assets', '8bit', '8bit-orientation-overrides.json'), 'utf8'));
const actionOverrides = JSON.parse(fs.readFileSync(path.join(projectRoot, 'assets', '8bit', '8bit-action-overrides.json'), 'utf8'));
const finalSpritePets = [
  'sunny-wing',
  'sprouty',
  'hydroblob',
  'fluffbit',
  'shadow-wing',
  'flame-rex',
  'thunder-beetle',
  'frost-fang',
  'volt-cheetah',
  'shadow-stalker',
  'crybaby',
  'hacipupu',
  'labubu',
  'skullpanda',
  'twinkle-twinkle',
  'pikachu',
  'mewtwo',
  'lucario',
  'greninja',
  'charizard',
  'psyduck',
  'squirtle',
  'wolf',
  'steve',
  'enderman',
  'enderdragon',
  'creeper',
  'kuromi',
  'my-melody',
  'cinnamoroll',
  'pochacco',
  'hello-kitty',
  'winnie-the-pooh',
  'crayon-shinchan',
  'ugly-fish',
  'yoyo'
];
const cuteFinalSpritePets = [
  'sunny-wing',
  'sprouty',
  'hydroblob',
  'fluffbit',
  'shadow-wing',
  'flame-rex',
  'thunder-beetle',
  'frost-fang',
  'volt-cheetah',
  'shadow-stalker',
  'pikachu',
  'mewtwo',
  'lucario',
  'greninja',
  'charizard',
  'psyduck',
  'squirtle',
  'wolf',
  'steve',
  'enderman',
  'enderdragon',
  'creeper',
  'winnie-the-pooh',
  'crayon-shinchan',
  'ugly-fish',
  'yoyo'
];
const finalSpriteFolders = [
  'characters',
  'heads',
  'characters-idle',
  'characters-idle-left',
  'characters-run-right',
  'characters-run-left',
  'characters-jump',
  'characters-jump-left',
  'characters-crouch',
  'characters-crouch-left',
  'characters-lie',
  'characters-lie-left'
];

function assertPng(relativePath) {
  const filePath = path.join(projectRoot, ...relativePath.split('/'));
  const buffer = fs.readFileSync(filePath);
  assert.equal(buffer.subarray(1, 4).toString('ascii'), 'PNG', `${relativePath} should be a PNG`);
  assert.equal(buffer.readUInt32BE(16), 256, `${relativePath} should be 256px wide`);
  assert.equal(buffer.readUInt32BE(20), 256, `${relativePath} should be 256px tall`);
}

test('all 8bit characters have directional idle, run, jump, crouch, and lie sprites', () => {
  assert.equal(manifest.length, 36);
  assert.equal(fs.existsSync(path.join(projectRoot, 'assets', '8bit', 'characters-source')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'assets', '8bit', 'characters-original-backup')), true);
  for (const entry of manifest) {
    assert.match(entry.idleImage, /^assets\/8bit\/characters-idle\/.+-8bit\.png$/);
    assert.match(entry.idleLeftImage, /^assets\/8bit\/characters-idle-left\/.+-8bit\.png$/);
    assert.match(entry.runRightImage, /^assets\/8bit\/characters-run-right\/.+-8bit\.png$/);
    assert.match(entry.runLeftImage, /^assets\/8bit\/characters-run-left\/.+-8bit\.png$/);
    assert.match(entry.jumpImage, /^assets\/8bit\/characters-jump\/.+-8bit\.png$/);
    assert.match(entry.jumpLeftImage, /^assets\/8bit\/characters-jump-left\/.+-8bit\.png$/);
    assert.match(entry.crouchImage, /^assets\/8bit\/characters-crouch\/.+-8bit\.png$/);
    assert.match(entry.crouchLeftImage, /^assets\/8bit\/characters-crouch-left\/.+-8bit\.png$/);
    assert.match(entry.lieImage, /^assets\/8bit\/characters-lie\/.+-8bit\.png$/);
    assert.match(entry.lieLeftImage, /^assets\/8bit\/characters-lie-left\/.+-8bit\.png$/);
    assertPng(entry.image);
    assertPng(entry.idleImage);
    assertPng(entry.idleLeftImage);
    assertPng(entry.runRightImage);
    assertPng(entry.runLeftImage);
    assertPng(entry.jumpImage);
    assertPng(entry.jumpLeftImage);
    assertPng(entry.crouchImage);
    assertPng(entry.crouchLeftImage);
    assertPng(entry.lieImage);
    assertPng(entry.lieLeftImage);
  }
});

test('8bit directional action sets are documented', () => {
  const manifestIds = manifest.map(entry => entry.id).sort();
  assert.deepEqual([...orientationOverrides.runRightIds].sort(), manifestIds);
  assert.deepEqual([...orientationOverrides.runLeftIds].sort(), manifestIds);
  assert.deepEqual([...orientationOverrides.idleLeftIds].sort(), manifestIds);
  assert.deepEqual([...orientationOverrides.jumpIds].sort(), manifestIds);
  assert.deepEqual([...orientationOverrides.jumpLeftIds].sort(), manifestIds);
  assert.deepEqual([...orientationOverrides.crouchIds].sort(), manifestIds);
  assert.deepEqual([...orientationOverrides.crouchLeftIds].sort(), manifestIds);
  assert.deepEqual([...orientationOverrides.lieIds].sort(), manifestIds);
  assert.deepEqual([...orientationOverrides.lieLeftIds].sort(), manifestIds);
  assert.deepEqual([...actionOverrides.characterOrder].sort(), manifestIds);
  assert.deepEqual(actionOverrides.actions, ['run-right', 'jump', 'crouch', 'lie']);
  assert.deepEqual(actionOverrides.mirroredActions, ['idle-left', 'run-left', 'jump-left', 'crouch-left', 'lie-left']);
  assert.match(actionOverrides.directionRequirement, /screen-right/);
  assert.match(orientationOverrides.leftDirectionRequirement, /horizontal mirrors/);
  assert.match(actionOverrides.motionRequirement.jump, /airborne|off the ground/);
  assert.match(actionOverrides.motionRequirement.crouch, /crouching|ducking/);
  assert.match(actionOverrides.motionRequirement.lie, /lying|sleeping/);
});

test('final-evolution 8bit sprite batch includes generated roles', () => {
  for (const petId of finalSpritePets) {
    for (const folder of finalSpriteFolders) {
      assertPng(`assets/8bit/final/${folder}/${petId}-8bit.png`);
    }
  }
});

test('cute final-evolution 8bit sprite batch includes distinct cute-route roles', () => {
  for (const petId of cuteFinalSpritePets) {
    for (const folder of finalSpriteFolders) {
      assertPng(`assets/8bit/cute-final/${folder}/${petId}-8bit.png`);
    }
  }
});

test('evolution 8bit directional sprites stay mirrored and keep internal details opaque', t => {
  const pillowCheck = spawnSync('python3', ['-c', 'import PIL'], { cwd: projectRoot });
  if (pillowCheck.status !== 0) {
    t.skip('Pillow is not available for sprite alpha verification.');
    return;
  }
  const result = spawnSync('python3', ['scripts/repair_8bit_sprite_assets.py', '--check'], {
    cwd: projectRoot,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  assert.equal(report.mirrorFailureCount, 0, 'left-facing sprites should be exact mirrors of their right-facing source');
  assert.equal(report.internalDetailHoleWarningCount, 0, 'mouth, eye, hand, and prop details should not be transparent holes');
  assert.equal(report.brightHoleWarningCount, 0, 'legacy bright detail warning field should stay clean');
});

test('cute-final cutouts keep ugly-fish eye whites opaque', t => {
  const pillowCheck = spawnSync('python3', ['-c', 'import PIL'], { cwd: projectRoot });
  if (pillowCheck.status !== 0) {
    t.skip('Pillow is not available for sprite alpha verification.');
    return;
  }
  const result = spawnSync('python3', ['-c', `
from pathlib import Path
from PIL import Image
root = Path.cwd()
checks = []
for rel in [
    'assets/8bit/cute-final/characters-idle/ugly-fish-8bit.png',
    'assets/8bit/cute-final/characters-run-right/ugly-fish-8bit.png',
]:
    image = Image.open(root / rel).convert('RGBA')
    opaque_light = sum(1 for red, green, blue, alpha in image.getdata() if alpha > 220 and red > 200 and green > 200 and blue > 190)
    checks.append((rel, opaque_light))
failed = [(rel, count) for rel, count in checks if count < 600]
if failed:
    raise SystemExit('not enough opaque light eye detail: ' + repr(failed))
print(checks)
`], {
    cwd: projectRoot,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
