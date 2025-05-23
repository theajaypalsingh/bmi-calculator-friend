<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          h1 {
            color: #1a73e8;
            font-size: 24px;
            margin-bottom: 20px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
            background-color: #fff;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          th {
            background-color: #f5f5f5;
            text-align: left;
            padding: 12px 15px;
            border-bottom: 1px solid #ddd;
          }
          td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
          }
          tr:hover td {
            background-color: #f9f9f9;
          }
          .url {
            max-width: 500px;
            word-break: break-all;
          }
          .priority {
            text-align: center;
            width: 100px;
          }
          .high {
            color: #007bff;
          }
          .medium {
            color: #28a745;
          }
          .low {
            color: #6c757d;
          }
          footer {
            margin-top: 20px;
            font-size: 13px;
            color: #666;
            text-align: center;
          }
          a {
            color: #1a73e8;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This is the XML sitemap for checkbmi.info, which is used to inform search engines about pages available for crawling.</p>
        <table id="sitemap">
          <tr>
            <th>URL</th>
            <th>Priority</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td class="url">
                <a href="{sitemap:loc}">
                  <xsl:value-of select="sitemap:loc"/>
                </a>
              </td>
              <td class="priority">
                <xsl:choose>
                  <xsl:when test="sitemap:priority &gt;= 0.9">
                    <span class="high"><xsl:value-of select="sitemap:priority"/></span>
                  </xsl:when>
                  <xsl:when test="sitemap:priority &gt;= 0.7">
                    <span class="medium"><xsl:value-of select="sitemap:priority"/></span>
                  </xsl:when>
                  <xsl:otherwise>
                    <span class="low"><xsl:value-of select="sitemap:priority"/></span>
                  </xsl:otherwise>
                </xsl:choose>
              </td>
            </tr>
          </xsl:for-each>
        </table>
        <footer>
          <p>Generated by BMI Calculator - <a href="https://checkbmi.info">checkbmi.info</a></p>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
