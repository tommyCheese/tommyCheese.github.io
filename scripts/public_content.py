"""Reject private execution context in public news and research content."""
import getpass
import html
import ipaddress
import re
import socket
from pathlib import Path
from urllib.parse import unquote


PRIVATE_MARKERS = re.compile(
    r'/(?:Users|home|tmp|private)/|(?-i:/Volumes/)|/var/(?:folders|tmp)/'
    r'|\b[A-Z]:[\\/]|\\\\[^\\\s]+\\|file://|~/'
    r'|\blocalhost\b|\bCODEX_HOME\b|\.codex[\\/]'
    r'|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'
    r'|\bsk-proj-[A-Za-z0-9_-]{32,}|\bsk-[A-Za-z0-9]{32,}'
    r'|\b(?:ghp_|github_pat_)[A-Za-z0-9_]{32,}'
    r'|Authorization\s*:\s*Bearer\s+\S+'
    r'|(?:api[_-]?key|access[_-]?token|password|secret)\s*[=:]\s*[\"\']?\S{8,}',
    re.IGNORECASE,
)
INTERNAL_CODE = re.compile(
    r'```|~~~|<\s*/?\s*(?:pre|code|script)\b'
    r'|Traceback \(most recent call last\)|\bnode_modules[\\/]'
    r'|\.venv[\\/]|\b(?:tool_call_id|session_id)\s*[=:]'
    r'|\bgit\s+(?:push|commit|status|diff|rev-parse)\b'
    r'|\b(?:python3?|node)\s+(?:scripts|tests)/',
    re.IGNORECASE,
)
LOCAL_NETS = tuple(ipaddress.ip_network(value) for value in (
    '10.0.0.0/8', '127.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16',
    '169.254.0.0/16', '::1/128', 'fc00::/7', 'fe80::/10',
))


def local_identifiers():
    # Compare at runtime; never save the operator's identity in the repository.
    generic = {'root', 'runner', 'user', 'admin', 'test', 'localhost'}
    values = {getpass.getuser(), Path.home().name, socket.gethostname()}
    return {v for v in values if len(v) >= 4 and v.lower() not in generic}


def check_text(text, location, *, private_only=False):
    # Encoded paths in reference/image URLs are public too.
    for _ in range(2):
        text = html.unescape(unquote(text))
    invalid = bool(PRIVATE_MARKERS.search(text))
    if not private_only:
        invalid |= bool(INTERNAL_CODE.search(text))
    for identifier in local_identifiers():
        invalid |= bool(re.search(r'(?<![\w-])' + re.escape(identifier) + r'(?![\w-])', text, re.I))
    for candidate in re.findall(r'(?<![\w.])(?:\d{1,3}\.){3}\d{1,3}(?![\w.])|\[[0-9a-f:]+\]', text, re.I):
        try:
            address = ipaddress.ip_address(candidate.strip('[]'))
        except ValueError:
            continue
        invalid |= any(address in network for network in LOCAL_NETS)
    if invalid:
        # Report the field, never repeat a possible credential or private path.
        raise ValueError(f'Private context or internal code in public content: {location}')


def check_tree(value, location):
    if isinstance(value, str):
        check_text(value, location)
    elif isinstance(value, dict):
        for key, child in value.items():
            check_tree(child, f'{location}.{key}')
    elif isinstance(value, list):
        for index, child in enumerate(value):
            check_tree(child, f'{location}[{index}]')


def check_public_content(catalogs, editorials, messages):
    for catalog, data in catalogs.items():
        check_tree(data, catalog)
    check_tree(editorials['articles'], 'editorials.articles')
    for locale, values in messages.items():
        for key, value in values.items():
            if key.startswith(('news.', 'research.')) or key in {'nav.news', 'nav.research'}:
                check_text(value, f'messages.{locale}.{key}')
