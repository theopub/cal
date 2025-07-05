FROM amazon/aws-cli
COPY scripts/init-localstack.sh /init-localstack.sh
RUN chmod +x /init-localstack.sh
ENTRYPOINT ["/init-localstack.sh"]
